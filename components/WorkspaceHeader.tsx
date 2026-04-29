"use client";

import { Braces, Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkspaceTabs from "@/components/WorkspaceTabs";
import { UserMode, Workspace, WorkspaceTab } from "@/lib/types";

const modeLabel: Record<UserMode, string> = {
  student: "Student",
  teacher: "Teacher",
  researcher: "Researcher",
  museum_educator: "Museum Educator",
};

// Inline pill with specific per-semantic colors
function Pill({ children, color, bg, title }: { children: React.ReactNode; color: string; bg: string; title?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, background: bg }}
      title={title}
    >
      {children}
    </span>
  );
}

export default function WorkspaceHeader({
  workspace, activeTab, onTabChange, onOpenChat,
}: {
  workspace: Workspace;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onOpenChat: () => void;
}) {
  const aiEnriched = workspace.status.aiMode === "enriched";

  return (
    <header className="shrink-0 border-b border-border p-4 backdrop-blur" style={{ background: "#0f1115" }}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onOpenChat} className="lg:hidden" aria-label="Open chat panel">
                <Menu className="h-4 w-4" />
              </Button>
              <Pill color="#38bdf8" bg="rgba(56,189,248,0.15)">{modeLabel[workspace.mode]}</Pill>
              <Pill color="#a9a59b" bg="rgba(255,255,255,0.07)">{workspace.lensType || "topic"}</Pill>
            </div>
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {workspace.title}
            </h1>
          </div>
          <div className="flex max-w-[720px] flex-wrap justify-end gap-2">
            <Pill color="#a9a59b" bg="rgba(255,255,255,0.07)">{workspace.status.sourcesLoaded} sources</Pill>
            <Pill color="#fbbf24" bg="rgba(251,191,36,0.15)">{workspace.status.evidenceCards} evidence cards</Pill>
            <Pill color="#38bdf8" bg="rgba(56,189,248,0.15)">{workspace.status.connectionsMapped} connections</Pill>
            {workspace.status.lessonReady && (
              <Pill color="#22c55e" bg="rgba(34,197,94,0.15)">lesson ready</Pill>
            )}
            <Pill
              color={aiEnriched ? "#38bdf8" : workspace.status.aiMode === "quota_exceeded" ? "#f87171" : "#a9a59b"}
              bg={aiEnriched ? "rgba(56,189,248,0.15)" : workspace.status.aiMode === "quota_exceeded" ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.07)"}
              title={workspace.status.aiMode === "quota_exceeded" ? "OpenAI quota exceeded — add credits at platform.openai.com/billing" : undefined}
            >
              {aiEnriched
                ? "AI enriched"
                : workspace.status.aiMode === "quota_exceeded"
                ? "quota exceeded"
                : workspace.status.aiMode === "unavailable"
                ? "API unavailable"
                : "live sources"}
            </Pill>
            <Button variant="ghost" size="sm" onClick={() => onTabChange("export")}>
              <Download className="h-3.5 w-3.5" />Export
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onTabChange("export")}>
              <Braces className="h-3.5 w-3.5" />API
            </Button>
          </div>
        </div>
        <WorkspaceTabs activeTab={activeTab} onChange={onTabChange} />
      </div>
    </header>
  );
}
