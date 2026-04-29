import { searchCrossref } from "@/lib/adapters/crossref";
import { searchEuropeana } from "@/lib/adapters/europeana";
import { searchLibraryOfCongress } from "@/lib/adapters/libraryOfCongress";
import { searchMetMuseum } from "@/lib/adapters/metMuseum";
import { searchMusicBrainz } from "@/lib/adapters/musicBrainz";
import { searchOpenAlex } from "@/lib/adapters/openAlex";
import { searchSmithsonian } from "@/lib/adapters/smithsonian";
import { searchWikidata } from "@/lib/adapters/wikidata";
import { SourceRecord } from "@/lib/types";

export async function searchSources(query: string): Promise<SourceRecord[]> {
  const results = await Promise.allSettled([
    searchOpenAlex(query),
    searchLibraryOfCongress(query),
    searchMetMuseum(query),
    searchMusicBrainz(query),
    searchEuropeana(query),
    searchSmithsonian(query),
    searchCrossref(query),
    searchWikidata(query),
  ]);

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

export const adapterStatus = [
  { provider: "openalex", status: "live (no key required)" },
  { provider: "library_of_congress", status: "live (no key required)" },
  { provider: "met_museum", status: "live (no key required)" },
  { provider: "musicbrainz", status: "live (no key required)" },
  { provider: "europeana", status: "live (EUROPEANA_API_KEY required)" },
  { provider: "smithsonian", status: "live (SMITHSONIAN_API_KEY required)" },
  { provider: "crossref", status: "live (no key required)" },
  { provider: "wikidata", status: "live (no key required)" },
];
