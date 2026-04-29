"use client";

import { useMemo, useState } from "react";
import EvidenceCard from "@/components/EvidenceCard";
import MetricCard from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClaimClassification, Workspace } from "@/lib/types";

const filters: Array<{ id: ClaimClassification | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "fact", label: "Fact" },
  { id: "context", label: "Context" },
  { id: "possible_connection", label: "Possible connection" },
  { id: "hypothesis", label: "Hypothesis" },
  { id: "analogy", label: "Analogy" },
  { id: "needs_review", label: "Needs review" },
];

export default function EvidenceTab({ workspace }: { workspace: Workspace }) {
  const [active, setActive] = useState<ClaimClassification | "all">("all");
  const cards = useMemo(
    () => active === "all" ? workspace.evidenceCards : workspace.evidenceCards.filter((c) => c.classification === active),
    [active, workspace.evidenceCards],
  );
  const avg = workspace.evidenceCards.length
    ? Math.round(workspace.evidenceCards.reduce((s, c) => s + c.confidence, 0) / workspace.evidenceCards.length)
    : 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3">
        <MetricCard label="Evidence cards" value={workspace.evidenceCards.length} />
        <MetricCard label="Needs review" value={workspace.evidenceCards.filter((c) => c.needsExpertReview).length} />
        <MetricCard label="Avg confidence" value={`${avg}%`} />
        <MetricCard label="Linked sources" value={new Set(workspace.evidenceCards.flatMap((c) => c.sourceIds)).size} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={active === f.id ? "default" : "ghost"}
            onClick={() => setActive(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-3 pr-3">
          {cards.map((card) => (
            <EvidenceCard key={card.id} card={card} sources={workspace.sourceRecords} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
