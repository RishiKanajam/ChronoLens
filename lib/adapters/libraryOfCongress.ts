import { SourceRecord } from "@/lib/types";

interface LocResult {
  title?: string | string[];
  date?: string;
  description?: string | string[];
  url?: string;
  image_url?: string[];
  original_format?: string[];
}

export async function searchLibraryOfCongress(query: string): Promise<SourceRecord[]> {
  try {
    const response = await fetch(
      `https://www.loc.gov/search/?q=${encodeURIComponent(query)}&fo=json&c=5`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { results?: LocResult[] };
    const results = data.results || [];
    return results
      .filter((r) => r.title)
      .map((r, index) => {
        const title = Array.isArray(r.title) ? r.title[0] : r.title || "Untitled";
        const description = Array.isArray(r.description)
          ? r.description[0]
          : r.description || "Item from the Library of Congress digital collections.";
        return {
          id: `loc-${index}-${encodeURIComponent(title).slice(0, 12)}`,
          provider: "library_of_congress",
          title,
          type: r.original_format?.some((format) => /photo|image|print|drawing/i.test(format))
            ? "image"
            : "book",
          institution: "Library of Congress",
          dateLabel: r.date,
          thumbnailUrl: r.image_url?.[0],
          externalUrl: r.url,
          rights: "Public domain (Library of Congress)",
          description,
          relevanceScore: 75,
        } satisfies SourceRecord;
      });
  } catch {
    return [];
  }
}
