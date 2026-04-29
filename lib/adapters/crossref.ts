import { SourceRecord } from "@/lib/types";

// Crossref is free and requires no API key.
// Polite pool: add email in User-Agent for faster responses.

interface CrossrefWork {
  DOI?: string;
  title?: string[];
  author?: Array<{ given?: string; family?: string }>;
  published?: { "date-parts"?: number[][] };
  publisher?: string;
  "container-title"?: string[];
  type?: string;
  abstract?: string;
  URL?: string;
}

export async function searchCrossref(query: string): Promise<SourceRecord[]> {
  try {
    const res = await fetch(
      `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5&select=DOI,title,author,published,publisher,container-title,type,abstract,URL`,
      {
        headers: {
          "User-Agent": "ChronoLens/0.1 (mailto:support@chronolens.app)",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { message?: { items?: CrossrefWork[] } };
    const items = data.message?.items ?? [];

    return items
      .filter((item) => item.title?.[0])
      .map((item): SourceRecord => {
        const author = item.author?.[0];
        const creatorName = author
          ? [author.given, author.family].filter(Boolean).join(" ")
          : undefined;
        const year = item.published?.["date-parts"]?.[0]?.[0];
        const journal = item["container-title"]?.[0];
        const typeRaw = item.type ?? "journal-article";
        const sourceType: SourceRecord["type"] =
          typeRaw === "book" || typeRaw === "monograph" ? "book" : "article";

        return {
          id: `crossref-${(item.DOI ?? Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/gi, "-")}`,
          provider: "crossref",
          title: item.title![0],
          type: sourceType,
          creator: creatorName,
          institution: item.publisher ?? "Crossref",
          collection: journal,
          dateLabel: year ? String(year) : undefined,
          externalUrl: item.URL ?? (item.DOI ? `https://doi.org/${item.DOI}` : undefined),
          rights: "Open access via Crossref",
          description: item.abstract
            ? item.abstract.replace(/<[^>]+>/g, "").slice(0, 200) + (item.abstract.length > 200 ? "…" : "")
            : `Scholarly ${typeRaw.replace(/-/g, " ")} indexed by Crossref. Published by ${item.publisher ?? "unknown publisher"}.`,
          relevanceScore: 80,
        };
      });
  } catch {
    return [];
  }
}
