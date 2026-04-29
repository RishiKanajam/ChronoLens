import { SourceRecord } from "@/lib/types";

// Wikidata is fully free and requires no API key.

interface WikidataEntity {
  id?: string;
  label?: string;
  description?: string;
  url?: string;
  concepturi?: string;
}

interface WikidataClaim {
  mainsnak?: {
    snaktype?: string;
    datavalue?: {
      value?: {
        text?: string;
        time?: string;
        "entity-type"?: string;
        id?: string;
      } | string;
    };
  };
}

export async function searchWikidata(query: string): Promise<SourceRecord[]> {
  try {
    // Step 1: Search for matching entities
    const searchRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&limit=5&format=json&origin=*`,
      { next: { revalidate: 3600 } },
    );
    if (!searchRes.ok) return [];

    const searchData = (await searchRes.json()) as { search?: WikidataEntity[] };
    const entities = searchData.search ?? [];

    if (!entities.length) return [];

    // Step 2: Fetch detailed claims for each entity (date, instance of, etc.)
    const ids = entities.map((e) => e.id).filter(Boolean).join("|");
    const detailRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids}&props=claims|labels|descriptions&languages=en&format=json&origin=*`,
      { next: { revalidate: 3600 } },
    );

    type EntityDetails = Record<string, {
      labels?: { en?: { value?: string } };
      descriptions?: { en?: { value?: string } };
      claims?: Record<string, WikidataClaim[]>;
    }>;

    let details: EntityDetails = {};
    if (detailRes.ok) {
      const detailData = (await detailRes.json()) as { entities?: EntityDetails };
      details = detailData.entities ?? {};
    }

    return entities
      .filter((e) => e.label)
      .map((entity): SourceRecord => {
        const det = details[entity.id ?? ""];
        const claims = det?.claims ?? {};

        // P571 = inception/date, P577 = publication date
        const dateClaim = (claims["P571"] ?? claims["P577"] ?? [])[0];
        const dateVal = dateClaim?.mainsnak?.datavalue?.value;
        const dateStr = typeof dateVal === "object" && dateVal?.time
          ? dateVal.time.slice(1, 5)   // extract year from "+YYYY-MM-DDT..."
          : undefined;

        // P31 = instance of (to determine type)
        const instanceClaim = (claims["P31"] ?? [])[0];
        const instanceVal = instanceClaim?.mainsnak?.datavalue?.value;
        const instanceId = typeof instanceVal === "object" ? instanceVal?.id : undefined;
        // Map common Wikidata instance IDs to our types
        const typeMap: Record<string, SourceRecord["type"]> = {
          Q482994: "music",   // album
          Q7366:   "music",   // song
          Q571:    "book",    // book
          Q17537576: "article", // creative work
          Q11424: "video",    // film
          Q79030: "manuscript",
        };
        const sourceType: SourceRecord["type"] = (instanceId ? typeMap[instanceId] : undefined) ?? "other";

        return {
          id: `wikidata-${entity.id ?? Math.random().toString(36).slice(2)}`,
          provider: "wikidata",
          title: entity.label ?? "Wikidata entity",
          type: sourceType,
          institution: "Wikidata / Wikimedia Foundation",
          dateLabel: dateStr,
          externalUrl: entity.concepturi ?? `https://www.wikidata.org/wiki/${entity.id}`,
          rights: "Open data (CC0 1.0 — Wikidata)",
          description: entity.description
            ? `${entity.description.charAt(0).toUpperCase()}${entity.description.slice(1)}.`
            : `Wikidata entity: ${entity.label}. Open structured knowledge base record.`,
          relevanceScore: 71,
        };
      });
  } catch {
    return [];
  }
}
