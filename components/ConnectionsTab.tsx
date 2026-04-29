"use client";

import { useState } from "react";
import PatternBridgeGraph from "@/components/PatternBridgeGraph";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionNode, Workspace } from "@/lib/types";

const relationLabels = [
  "direct evidence", "shared motif", "same region",
  "same period", "possible influence", "analogy only",
];

export default function ConnectionsTab({ workspace }: { workspace: Workspace }) {
  const [selected, setSelected] = useState<ConnectionNode>(workspace.connectionGraph.nodes[0]);
  const linkedEvidence = workspace.evidenceCards.filter((c) => selected.evidenceCardIds?.includes(c.id));
  const linkedSources = workspace.sourceRecords.filter((s) => selected.sourceIds?.includes(s.id));

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_340px]">
      <section className="min-h-0 space-y-4">
        <PatternBridgeGraph workspace={workspace} onSelectNode={setSelected} />
        <Card>
          <CardContent className="p-4 flex flex-wrap gap-2">
            {relationLabels.map((label) => (
              <Badge key={label} variant="muted">{label}</Badge>
            ))}
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-primary mb-1">Selected node</p>
            <h2 className="text-xl font-semibold text-foreground">{selected.label}</h2>
            <Badge variant="accent" className="mt-1">{selected.type}</Badge>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{selected.explanation}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}
