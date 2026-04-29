"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceTab } from "@/lib/types";

const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "atlas", label: "Atlas" },
  { id: "sources", label: "Sources" },
  { id: "evidence", label: "Evidence" },
  { id: "connections", label: "Connections" },
  { id: "timeline", label: "Timeline" },
  { id: "geography", label: "Geography" },
  { id: "image", label: "Image Lab" },
  { id: "architecture", label: "Architecture" },
  { id: "study", label: "Study" },
  { id: "infographics", label: "Infographics" },
  { id: "teach", label: "Teach" },
  { id: "discoveries", label: "Discoveries" },
  { id: "export", label: "Export" },
];

export default function WorkspaceTabs({
  activeTab,
  onChange,
}: {
  activeTab: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
}) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onChange(v as WorkspaceTab)}>
      <div className="overflow-x-auto">
        <TabsList className="flex w-max gap-0.5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
