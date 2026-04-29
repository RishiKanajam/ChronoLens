import { SourceRecord } from "@/lib/types";

// Free API key: https://pro.europeana.eu/pages/get-api
// Add EUROPEANA_API_KEY to .env.local

interface EuropeanaItem {
  id?: string;
  title?: string | string[];
  dcCreator?: string | string[];
  year?: string | string[];
  dataProvider?: string | string[];
  edmIsShownAt?: string | string[];
  edmPreview?: string | string[];
  rights?: string | string[];
  type?: string;
}

function first<T>(v: T | T[] | undefined): T | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function searchEuropeana(query: string): Promise<SourceRecord[]> {
  const key = process.env.EUROPEANA_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.europeana.eu/record/v2/search.json?wskey=${encodeURIComponent(key)}&query=${encodeURIComponent(query)}&rows=5&reusability=open`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { items?: EuropeanaItem[] };
    const items = data.items ?? [];

    return items.map((item): SourceRecord => {
      const typeRaw = item.type?.toLowerCase() ?? "other";
      const sourceType: SourceRecord["type"] =
        typeRaw === "image" ? "image" :
        typeRaw === "text"  ? "book"  :
        typeRaw === "sound" ? "audio" :
        typeRaw === "video" ? "video" : "other";

      return {
        id: `europeana-${(item.id ?? Math.random().toString(36).slice(2)).replace(/\//g, "-")}`,
        provider: "europeana",
        title: first(item.title) ?? "Europeana record",
        type: sourceType,
        creator: first(item.dcCreator),
        institution: first(item.dataProvider) ?? "Europeana",
        collection: "Europeana Digital Heritage",
        dateLabel: first(item.year),
        thumbnailUrl: first(item.edmPreview),
        externalUrl: first(item.edmIsShownAt),
        rights: first(item.rights) ?? "Open access (Europeana)",
        description: `European digital heritage record from ${first(item.dataProvider) ?? "a contributing institution"}. Type: ${typeRaw}.`,
        relevanceScore: 76,
      };
    });
  } catch {
    return [];
  }
}
