"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AtlasTab from "@/components/AtlasTab";
import ConnectionsTab from "@/components/ConnectionsTab";
import EvidenceTab from "@/components/EvidenceTab";
import LeftChatPanel from "@/components/LeftChatPanel";
import SourcesTab from "@/components/SourcesTab";
import StudyTab from "@/components/StudyTab";
import TeachTab from "@/components/TeachTab";
import TimelineTab from "@/components/TimelineTab";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import ImageLabTab from "@/components/ImageLabTab";
import GeographyTab from "@/components/GeographyTab";
import InfographicsTab from "@/components/InfographicsTab";
import DiscoveriesTab from "@/components/DiscoveriesTab";
import ExportTab from "@/components/ExportTab";
import { ChatMessageModel } from "@/components/ChatMessage";
import { Workspace, WorkspaceTab } from "@/lib/types";


function summaryFor(workspace: Workspace) {
  return `Workspace ready: ${workspace.status.sourcesLoaded} sources, ${workspace.status.evidenceCards} evidence cards, ${workspace.status.connectionsMapped} connections, and a lesson module. Start with Atlas or Sources.`;
}

export default function ChronoWorkspaceShell({
  initialWorkspace,
  initialTab,
}: {
  initialWorkspace: Workspace;
  initialTab?: string;
}) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(
    (["atlas", "sources", "evidence", "connections", "timeline", "geography", "image", "study", "infographics", "teach", "discoveries", "export"].includes(initialTab || "")
      ? initialTab
      : "atlas") as WorkspaceTab,
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageModel[]>(() => [
    {
      id: "assistant-intro",
      type: "assistant",
      text: summaryFor(initialWorkspace),
    },
  ]);

  const activePanel = useMemo(() => {
    if (activeTab === "atlas") return <AtlasTab workspace={workspace} />;
    if (activeTab === "sources") return <SourcesTab workspace={workspace} onWorkspaceChange={setWorkspace} />;
    if (activeTab === "evidence") return <EvidenceTab workspace={workspace} />;
    if (activeTab === "connections") return <ConnectionsTab workspace={workspace} />;
    if (activeTab === "timeline") return <TimelineTab workspace={workspace} />;
    if (activeTab === "geography") return <GeographyTab workspace={workspace} />;
    if (activeTab === "image") return <ImageLabTab workspace={workspace} onWorkspaceChange={setWorkspace} />;
    if (activeTab === "study") return <StudyTab workspace={workspace} />;
    if (activeTab === "infographics") return <InfographicsTab workspace={workspace} />;
    if (activeTab === "teach") return <TeachTab workspace={workspace} onWorkspaceChange={setWorkspace} />;
    if (activeTab === "discoveries") return <DiscoveriesTab workspace={workspace} />;
    return <ExportTab workspace={workspace} onWorkspaceChange={setWorkspace} />;
  }, [activeTab, workspace]);

  const readAloudText = useMemo(() => {
    if (activeTab === "study") return `${workspace.summary} ${workspace.studyModule.overview}`;
    if (activeTab === "teach") return `${workspace.summary} ${workspace.lessonPack.objective}`;
    return `${workspace.summary} Active tab: ${activeTab}.`;
  }, [activeTab, workspace]);

  async function submitQuery(query: string) {
    setLoading(true);
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, type: "user", text: query },
    ]);

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode: workspace.mode, lensType: "topic" }),
      });

      if (!response.ok) throw new Error("Workspace creation failed");
      const nextWorkspace = (await response.json()) as Workspace;
      setWorkspace(nextWorkspace);
      setActiveTab("atlas");
      setChatOpen(false);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          text: summaryFor(nextWorkspace),
        },
        {
          id: `source-${Date.now()}`,
          type: "source",
          title: "Suggested next steps",
          detail: "Open Sources, Build Lesson, Show Connections, or Study Mode from the quick chips.",
        },
      ]);
      router.replace(`/workspace/${nextWorkspace.id}`);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          type: "assistant",
          text: "I could not create a new workspace, so the current workspace remains loaded.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function chipSelect(tab: WorkspaceTab) {
    setActiveTab(tab);
    setChatOpen(false);
  }

  function resetWorkspace() {
    setActiveTab("atlas");
    setMessages([
      {
        id: `assistant-reset-${Date.now()}`,
        type: "assistant",
        text: "Ready for a new query. Type below to generate a new workspace.",
      },
    ]);
    setChatOpen(false);
  }

  return (
    <div className="h-[calc(100vh-65px)] overflow-hidden bg-[#05070a] p-0 text-vellum lg:p-3">
      <div className="mx-auto flex h-full max-w-[1800px] overflow-hidden bg-ink shadow-soft lg:rounded-[28px] lg:ring-1 lg:ring-white/10">
        <div className="hidden w-[460px] shrink-0 border-r border-white/8 lg:block">
          <LeftChatPanel
            messages={messages}
            workspace={workspace}
            onSubmitQuery={submitQuery}
            onChipSelect={chipSelect}
            onNewQuery={resetWorkspace}
            
            readAloudText={readAloudText}
            loading={loading}
          />
        </div>
        {chatOpen ? (
          <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
            <div className="h-full w-[min(92vw,460px)]">
              <LeftChatPanel
                messages={messages}
                workspace={workspace}
                onSubmitQuery={submitQuery}
                onChipSelect={chipSelect}
                onNewQuery={resetWorkspace}
                
                readAloudText={readAloudText}
                loading={loading}
              />
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setChatOpen(false)}
              className="absolute inset-y-0 right-0 w-[8vw]"
            />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkspaceHeader
            workspace={workspace}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenChat={() => setChatOpen(true)}
          />
          <main className="min-h-0 flex-1 overflow-y-auto p-6" style={{ background: "#050607" }}>
            {activePanel}
          </main>
        </div>
      </div>
    </div>
  );
}
