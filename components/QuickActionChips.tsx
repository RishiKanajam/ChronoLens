"use client";

import { Button } from "@/components/ui/button";
import { WorkspaceTab } from "@/lib/types";

const chips: Array<{ label: string; tab: WorkspaceTab }> = [
  { label: "Atlas", tab: "atlas" },
  { label: "Sources", tab: "sources" },
  { label: "Evidence", tab: "evidence" },
  { label: "Connections", tab: "connections" },
  { label: "Study", tab: "study" },
  { label: "Teach", tab: "teach" },
  { label: "Export", tab: "export" },
];

export default function QuickActionChips({
  onSelect,
  compact = false,
}: {
  onSelect: (tab: WorkspaceTab) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "pl-10" : ""}`}>
      {chips.map((chip) => (
        <Button
          key={chip.label}
          variant="ghost"
          size="sm"
          onClick={() => onSelect(chip.tab)}
        >
          {chip.label}
        </Button>
      ))}
    </div>
  );
}
