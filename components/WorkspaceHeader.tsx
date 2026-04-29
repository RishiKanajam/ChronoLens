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
      className="inline-flex items-center rounded-full border border-black/5 px-2.5 py-1 text-xs font-medium shadow-sm"
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
    <header className="shrink-0 border-b border-border bg-[#fffaf1] p-3 md:p-4">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onOpenChat} className="lg:hidden" aria-label="Open chat panel">
                <Menu className="h-4 w-4" />
              </Button>
              <Pill color="#0f766e" bg="#dff3ee">{modeLabel[workspace.mode]}</Pill>
              <Pill color="#5b5548" bg="#eee7da">{workspace.lensType || "topic"}</Pill>
            </div>
            <h1 className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {workspace.title}
            </h1>
          </div>
          <div className="flex min-w-0 flex-wrap items-start gap-2 xl:max-w-[760px] xl:justify-end">
            <Pill color="#5b5548" bg="#fff">{workspace.status.sourcesLoaded} sources</Pill>
            <Pill color="#9a6417" bg="#f7ead2">{workspace.status.evidenceCards} evidence cards</Pill>
            <Pill color="#0f766e" bg="#dff3ee">{workspace.status.connectionsMapped} connections</Pill>
            {workspace.status.lessonReady && (
              <Pill color="#15803d" bg="#dcfce7">lesson ready</Pill>
            )}
            <Pill
              color={aiEnriched ? "#0f766e" : workspace.status.aiMode === "quota_exceeded" ? "#b91c1c" : "#5b5548"}
              bg={aiEnriched ? "#dff3ee" : workspace.status.aiMode === "quota_exceeded" ? "#fee2e2" : "#eee7da"}
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
