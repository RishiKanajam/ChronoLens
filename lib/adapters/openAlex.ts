import { SourceRecord } from "@/lib/types";

interface OpenAlexWork {
  id: string;
  title?: string;
  publication_year?: number;
  doi?: string;
  type?: string;
  authorships?: Array<{ author?: { display_name?: string } }>;
  primary_location?: { source?: { display_name?: string } };
}

export async function searchOpenAlex(query: string): Promise<SourceRecord[]> {
  try {
    const response = await fetch(
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=5`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { results?: OpenAlexWork[] };
    const works = data.results || [];
    return works
      .filter((w) => w.title)
      .map((w) => ({
        id: `openalex-${w.id.split("/").pop()}`,
        provider: "openalex",
        title: w.title || "Untitled work",
        type: "article",
        creator: w.authorships?.[0]?.author?.display_name,
        institution: w.primary_location?.source?.display_name || "OpenAlex",
        dateLabel: w.publication_year ? String(w.publication_year) : undefined,
        externalUrl: w.doi ? `https://doi.org/${w.doi}` : undefined,
        rights: "Open access (OpenAlex)",
        description: `Scholarly work indexed by OpenAlex. Type: ${w.type || "unknown"}.`,
        relevanceScore: 78,
      } satisfies SourceRecord));
  } catch {
    return [];
  }
}
