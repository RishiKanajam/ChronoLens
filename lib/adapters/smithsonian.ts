import { SourceRecord } from "@/lib/types";

// Free API key: https://api.si.edu/openaccess/api/v1.0/
// Add SMITHSONIAN_API_KEY to .env.local

interface SIRow {
  id?: string;
  title?: string;
  content?: {
    descriptiveNonRepeating?: {
      title?: { content?: string };
      data_source?: string;
      guid?: string;
      unit_code?: string;
      online_media?: {
        media?: Array<{ thumbnail?: string; content?: string; type?: string }>;
      };
    };
    indexedStructured?: {
      date?: string[];
      creator?: string[];
      object_type?: string[];
    };
    freetext?: {
      notes?: Array<{ content?: string; label?: string }>;
    };
  };
}

export async function searchSmithsonian(query: string): Promise<SourceRecord[]> {
  const key = process.env.SMITHSONIAN_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(query)}&api_key=${encodeURIComponent(key)}&rows=5`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { response?: { rows?: SIRow[] } };
    const rows = data.response?.rows ?? [];

    return rows.map((row): SourceRecord => {
      const dnr = row.content?.descriptiveNonRepeating;
      const indexed = row.content?.indexedStructured;
      const title = dnr?.title?.content ?? row.title ?? "Smithsonian object";
      const media = dnr?.online_media?.media?.[0];
      const thumbnail = media?.thumbnail ?? media?.content;
      const objTypes = indexed?.object_type ?? [];
      const rawType = objTypes[0]?.toLowerCase() ?? "";
      const sourceType: SourceRecord["type"] =
        rawType.includes("photograph") || rawType.includes("image") ? "image" :
        rawType.includes("manuscript") || rawType.includes("document") ? "manuscript" :
        rawType.includes("map") ? "map" : "museum_object";

      const descNote = row.content?.freetext?.notes?.find((n) => n.label === "Summary" || n.label === "Description");

      return {
        id: `smithsonian-${row.id ?? Math.random().toString(36).slice(2)}`,
        provider: "smithsonian",
        title,
        type: sourceType,
        creator: indexed?.creator?.[0],
        institution: "Smithsonian Institution",
        collection: dnr?.data_source ?? dnr?.unit_code,
        dateLabel: indexed?.date?.[0],
        thumbnailUrl: thumbnail,
        externalUrl: dnr?.guid,
        rights: "Open access (Smithsonian)",
        description: descNote?.content ?? `${title}. Smithsonian ${dnr?.data_source ?? "collection"} object.`,
        relevanceScore: 79,
      };
    });
  } catch {
    return [];
  }
}
