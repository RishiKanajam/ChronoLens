"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppFrame from "@/components/AppFrame";
import SourceCard from "@/components/SourceCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SourceRecord } from "@/lib/types";

const collections = [
  { emoji: "📚", provider: "Library of Congress", name: "World Digital Library", count: "2.1M items" },
  { emoji: "🏛️", provider: "Met Museum", name: "Asian Art Collection", count: "35K items" },
  { emoji: "🎵", provider: "MusicBrainz", name: "World Music Archive", count: "1.8M recordings" },
  { emoji: "📖", provider: "OpenAlex", name: "Cultural Studies Research", count: "4.2M papers" },
  { emoji: "🖼️", provider: "Europeana", name: "European Cultural Heritage", count: "50M items" },
  { emoji: "🏺", provider: "Smithsonian", name: "Global Collections", count: "155M items" },
];

export default function ArchivePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [selected, setSelected] = useState<Record<string, SourceRecord>>({});
  const [loading, setLoading] = useState(false);

  async function search(overrideQuery?: string) {
    setLoading(true);
    const q = overrideQuery ?? query;
    const response = await fetch("/api/search-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    const data = (await response.json()) as { sources: SourceRecord[] };
    setSources(data.sources);
    setLoading(false);
  }

  async function createWorkspace() {
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query || "Archive source workspace",
        mode: "researcher",
        lensType: "topic",
        sourceRecords: Object.values(selected),
      }),
    });
    const workspace = (await response.json()) as { id: string };
    router.push(`/workspace/${workspace.id}?tab=sources`);
  }

  function browseCollection(collectionName: string) {
    setQuery(collectionName);
    search(collectionName);
  }

  return (
    <AppFrame>
      <main className="mx-auto max-w-7xl px-5 py-12 space-y-8">
        <h1 className="text-4xl font-semibold text-foreground">Search archives and research sources</h1>

        {/* Explore collections */}
        <section>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Explore collections</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {collections.map((col) => (
              <Card
                key={col.name}
                className="shrink-0 w-52 cursor-pointer transition-colors hover:border-primary/60 hover:bg-card/80"
                onClick={() => browseCollection(col.name)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{col.emoji}</span>
                    <Badge variant="muted" className="text-[10px]">{col.count}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-primary">{col.provider}</p>
                  <p className="text-sm font-medium text-foreground leading-5">{col.name}</p>
                  <Button size="sm" variant="ghost" className="w-full text-xs">Browse</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Search bar */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") search(); }}
                placeholder="Search title, institution, collection…"
                className="flex-1"
              />
              <Button onClick={() => search()} disabled={loading}>
                {loading ? "Searching…" : "Search"}
              </Button>
              <Button
                variant="secondary"
                onClick={createWorkspace}
                disabled={!Object.keys(selected).length}
              >
                Create workspace from selected
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["OpenAlex", "Library of Congress", "Met Museum", "MusicBrainz", "Wikidata", "Europeana", "Smithsonian", "Crossref"].map((item) => (
                <Badge key={item} variant="muted">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {sources.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                selected={Boolean(selected[source.id])}
                onSelect={() =>
                  setSelected((cur) =>
                    cur[source.id]
                      ? Object.fromEntries(Object.entries(cur).filter(([id]) => id !== source.id))
                      : { ...cur, [source.id]: source },
                  )
                }
                onUseAsEvidence={() => setSelected((cur) => ({ ...cur, [source.id]: source }))}
              />
            ))}
          </div>
        )}
      </main>
    </AppFrame>
  );
}
