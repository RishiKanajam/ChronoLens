"use client";

import { useMemo, useState } from "react";
import SourceCard from "@/components/SourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SourceRecord, Workspace } from "@/lib/types";

const filters: Array<{ label: string; type?: SourceRecord["type"] }> = [
  { label: "Images", type: "image" },
  { label: "Books", type: "book" },
  { label: "Scholarly", type: "article" },
  { label: "Music", type: "music" },
  { label: "Museum", type: "museum_object" },
  { label: "Manuscripts", type: "manuscript" },
  { label: "Maps", type: "map" },
  { label: "Open access" },
];

export default function SourcesTab({
  workspace,
  onWorkspaceChange,
}: {
  workspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<SourceRecord["type"] | "open" | "all">("all");
  const [selectedId, setSelectedId] = useState(workspace.sourceRecords[0]?.id);
  const [searching, setSearching] = useState(false);
  const selected = workspace.sourceRecords.find((s) => s.id === selectedId);

  const sources = useMemo(() => {
    return workspace.sourceRecords.filter((s) => {
      const matchesQuery = `${s.title} ${s.description} ${s.institution}`
        .toLowerCase().includes(query.toLowerCase());
      const matchesType =
        activeType === "all" ||
        (activeType === "open" ? s.rights?.toLowerCase().includes("open") : s.type === activeType);
      return matchesQuery && matchesType;
    });
  }, [activeType, query, workspace.sourceRecords]);

  async function addAsEvidence(sourceId: string) {
    const response = await fetch(`/api/workspaces/${workspace.id}/use-source`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceId }),
    });
    if (response.ok) {
      onWorkspaceChange((await response.json()) as Workspace);
      return;
    }
    const source = workspace.sourceRecords.find((s) => s.id === sourceId);
    if (!source) return;
    onWorkspaceChange({
      ...workspace,
      evidenceCards: [
        {
          id: `ev-local-${sourceId}-${Date.now()}`,
          claim: `The source "${source.title}" may provide useful context for "${workspace.title}".`,
          classification: "context",
          evidence: [source.description || "Source metadata selected from live archive search."],
          sourceIds: [source.id],
          confidence: source.relevanceScore,
          uncertainty: "This source was added client-side from live search; verify before making cultural claims.",
          counterEvidence: ["Relevance is not the same as proof of a cultural connection."],
          needsExpertReview: false,
        },
        ...workspace.evidenceCards,
      ],
      status: { ...workspace.status, evidenceCards: workspace.status.evidenceCards + 1 },
    });
  }

  async function searchLiveSources() {
    if (!query.trim() || searching) return;
    setSearching(true);
    try {
      const response = await fetch("/api/search-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await response.json()) as { sources?: SourceRecord[] };
      const nextSources = [...(data.sources || []), ...workspace.sourceRecords].filter(
        (source, index, all) =>
          all.findIndex((item) => `${item.provider}:${item.title}` === `${source.provider}:${source.title}`) === index,
      );
      onWorkspaceChange({
        ...workspace,
        sourceRecords: nextSources,
        status: { ...workspace.status, sourcesLoaded: nextSources.length },
      });
      setSelectedId(nextSources[0]?.id);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_340px]">
      <section className="flex min-h-0 flex-col gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") searchLiveSources(); }}
                placeholder="Search source title, provider, institution…"
              />
              <Button onClick={searchLiveSources} disabled={searching || !query.trim()}>
                {searching ? "Searching…" : "Search APIs"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={activeType === "all" ? "default" : "ghost"}
                onClick={() => setActiveType("all")}
              >
                All
              </Button>
              {filters.map((f) => (
                <Button
                  key={f.label}
                  size="sm"
                  variant={activeType === (f.type || "open") ? "default" : "ghost"}
                  onClick={() => setActiveType(f.type || "open")}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 pr-3 lg:grid-cols-2">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                selected={source.id === selectedId}
                onSelect={() => setSelectedId(source.id)}
                onUseAsEvidence={() => addAsEvidence(source.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </section>
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-semibold text-primary mb-4">Inspector</p>
          {selected ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold leading-6 text-foreground">{selected.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{selected.description}</p>
              <dl className="space-y-2 text-sm">
                {[
                  ["Provider", selected.provider],
                  ["Institution", `${selected.institution || "Unknown"} / ${selected.collection || "Unknown"}`],
                  ["Creator", selected.creator || "Unknown"],
                  ["Date", selected.dateLabel || selected.period || "Unknown"],
                  ["Rights", selected.rights || "Unknown"],
                ].map(([dt, dd]) => (
                  <div key={dt}>
                    <dt className="text-muted-foreground/60 text-xs">{dt}</dt>
                    <dd className="text-foreground">{dd}</dd>
                  </div>
                ))}
              </dl>
              <Button className="w-full" onClick={() => addAsEvidence(selected.id)}>
                Use as evidence
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a source card to inspect metadata.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
