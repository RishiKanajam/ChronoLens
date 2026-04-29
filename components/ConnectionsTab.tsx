"use client";

import { useEffect, useMemo, useState } from "react";
import PatternBridgeGraph from "@/components/PatternBridgeGraph";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionEdge, ConnectionNode, Workspace } from "@/lib/types";

const relationMeta: Record<ConnectionEdge["relationType"], { label: string; color: string; note: string }> = {
  direct_evidence: { label: "Direct evidence", color: "#0f766e", note: "source-backed" },
  shared_motif: { label: "Shared motif", color: "#b7791f", note: "pattern match" },
  same_region: { label: "Same region", color: "#16a34a", note: "place metadata" },
  same_period: { label: "Same period", color: "#ea580c", note: "time overlap" },
  possible_influence: { label: "Possible influence", color: "#7c3aed", note: "needs review" },
  analogy_only: { label: "Analogy only", color: "#64748b", note: "not proof" },
};

function edgeConfidence(edge: ConnectionEdge) {
  const raw = Number(edge.confidence);
  if (!Number.isFinite(raw)) return 55;
  return raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
}

export default function ConnectionsTab({ workspace }: { workspace: Workspace }) {
  const [selected, setSelected] = useState<ConnectionNode | undefined>(workspace.connectionGraph.nodes[0]);
  const nodes = workspace.connectionGraph.nodes;
  const edges = workspace.connectionGraph.edges;

  useEffect(() => {
    setSelected(workspace.connectionGraph.nodes[0]);
  }, [workspace.id, workspace.connectionGraph.nodes]);

  const selectedEdges = useMemo(
    () => edges.filter((edge) => edge.source === selected?.id || edge.target === selected?.id),
    [edges, selected?.id],
  );

  const relatedNodes = selectedEdges
    .map((edge) => nodes.find((node) => node.id === (edge.source === selected?.id ? edge.target : edge.source)))
    .filter(Boolean) as ConnectionNode[];

  const sourceIds = selected?.sourceIds || [];
  const linkedEvidence = workspace.evidenceCards.filter((card) => {
    const linkedByEvidenceId = selected?.evidenceCardIds?.includes(card.id);
    const linkedBySource = sourceIds.some((sourceId) => card.sourceIds.includes(sourceId));
    return linkedByEvidenceId || linkedBySource;
  });
  const linkedSources = workspace.sourceRecords.filter((source) => sourceIds.includes(source.id));
  const relationCounts = edges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.relationType] = (acc[edge.relationType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-h-0 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Connection density</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{edges.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">relationships across {nodes.length} nodes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Evidence-backed</p>
              <p className="mt-1 text-2xl font-semibold text-primary">{relationCounts.direct_evidence || 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">direct source links</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Caution layer</p>
              <p className="mt-1 text-2xl font-semibold text-accent">
                {(relationCounts.possible_influence || 0) + (relationCounts.analogy_only || 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">interpretive links flagged</p>
            </CardContent>
          </Card>
        </div>
        <PatternBridgeGraph workspace={workspace} onSelectNode={setSelected} />
        <Card>
          <CardContent className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(relationMeta).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-3 rounded-md bg-[#fffaf1] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">{meta.label}</p>
                  <p className="text-[11px] text-muted-foreground">{meta.note}</p>
                </div>
                <Badge variant="muted" className="ml-auto">{relationCounts[key] || 0}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Card className="xl:sticky xl:top-0 xl:self-start">
        <CardContent className="p-5 space-y-4">
          {selected ? (
            <>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">Selected node</p>
                <h2 className="text-xl font-semibold leading-7 text-foreground">{selected.label}</h2>
                <Badge variant="accent" className="mt-2">{selected.type.replace(/_/g, " ")}</Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {selected.explanation || "This node is part of the workspace pattern bridge. Use linked sources and evidence cards before treating it as a conclusion."}
              </p>
          <Card className="bg-background/60">
            <CardContent className="p-4 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground/60">Confidence</p>
                <p className="text-2xl font-semibold text-foreground">{selected.confidence || 0}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60">Uncertainty</p>
                <p className="text-sm leading-5 text-muted-foreground">{selected.uncertainty || "Not specified."}</p>
              </div>
            </CardContent>
          </Card>
          <div>
            <p className="mb-2 text-xs font-medium text-primary">Relationships from this node</p>
            <div className="space-y-2">
              {selectedEdges.length ? selectedEdges.map((edge) => {
                const meta = relationMeta[edge.relationType];
                const other = nodes.find((node) => node.id === (edge.source === selected.id ? edge.target : edge.source));
                return (
                  <div key={`${edge.source}-${edge.target}-${edge.label}`} className="rounded-md border border-border bg-[#fffaf1] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold" style={{ color: meta.color }}>{meta.label}</span>
                      <Badge variant="muted">{edgeConfidence(edge)}%</Badge>
                    </div>
                    <p className="mt-1 text-xs font-medium text-foreground">{other?.label || "Related node"}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{edge.label}</p>
                  </div>
                );
              }) : (
                <p className="text-sm text-muted-foreground/60">No relationships linked to this node yet.</p>
              )}
            </div>
          </div>
          {relatedNodes.length ? (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Nearby nodes</p>
              <div className="flex flex-wrap gap-1.5">
                {relatedNodes.slice(0, 6).map((node) => (
                  <Badge key={node.id} variant="muted">{node.label}</Badge>
                ))}
              </div>
            </div>
          ) : null}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-primary mb-2">Linked evidence</p>
              <div className="space-y-2">
                {linkedEvidence.length ? linkedEvidence.map((c) => (
                  <Card key={c.id} className="bg-background/60">
                    <CardContent className="p-3 text-sm leading-5 text-muted-foreground">{c.claim}</CardContent>
                  </Card>
                )) : <p className="text-sm text-muted-foreground/60">No linked evidence cards.</p>}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-accent mb-2">Linked sources</p>
              <div className="space-y-2">
                {linkedSources.length ? linkedSources.map((s) => (
                  <Card key={s.id} className="bg-background/60">
                    <CardContent className="p-3 text-sm leading-5 text-muted-foreground">{s.title}</CardContent>
                  </Card>
                )) : <p className="text-sm text-muted-foreground/60">No linked sources.</p>}
              </div>
            </div>
          </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a node to inspect its relationships, evidence, and source links.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
