import { SourceRecord } from "@/lib/types";

export async function searchMetMuseum(query: string): Promise<SourceRecord[]> {
  try {
    const search = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } },
    );
    if (!search.ok) return [];
    const data = (await search.json()) as { objectIDs?: number[] };
    const ids = data.objectIDs?.slice(0, 4) || [];
    const records = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
          { next: { revalidate: 3600 } },
        );
        if (!response.ok) return null;
        const item = (await response.json()) as {
          objectID: number;
          title?: string;
          objectDate?: string;
          artistDisplayName?: string;
          department?: string;
          culture?: string;
          primaryImageSmall?: string;
          objectURL?: string;
          isPublicDomain?: boolean;
          medium?: string;
        };
        return {
          id: `met-${item.objectID}`,
          provider: "met_museum",
          title: item.title || "Met Museum object",
          type: "museum_object",
          creator: item.artistDisplayName || item.culture,
          institution: "The Metropolitan Museum of Art",
          collection: item.department,
          dateLabel: item.objectDate,
          thumbnailUrl: item.primaryImageSmall,
          externalUrl: item.objectURL,
          rights: item.isPublicDomain ? "Public domain" : "Rights vary",
          description: item.medium || "Museum object record from the Met collection API.",
          relevanceScore: 82,
        } satisfies SourceRecord;
      }),
    );
    return records.filter(Boolean) as SourceRecord[];
  } catch {
    return [];
  }
}
