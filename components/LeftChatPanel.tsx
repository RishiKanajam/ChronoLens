"use client";

import { Plus } from "lucide-react";
import ChatMessage, { ChatMessageModel } from "@/components/ChatMessage";
import QueryInput from "@/components/QueryInput";
import QuickActionChips from "@/components/QuickActionChips";
import ReadAloudButton from "@/components/ReadAloudButton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workspace, WorkspaceTab } from "@/lib/types";

export default function LeftChatPanel({
  messages, workspace, onSubmitQuery, onChipSelect, onNewQuery, readAloudText, loading,
}: {
  messages: ChatMessageModel[];
  workspace: Workspace;
  onSubmitQuery: (query: string) => void;
  onChipSelect: (tab: WorkspaceTab) => void;
  onNewQuery: () => void;
  readAloudText: string;
  loading?: boolean;
}) {
  return (
    <aside className="flex h-full flex-col gap-3 bg-[#fffaf1] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-foreground">ChronoLens</h2>
          <p className="text-xs text-muted-foreground">Cultural Evidence OS</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onNewQuery}>
          <Plus className="h-3.5 w-3.5" />New Query
        </Button>
      </div>
      <p className="rounded-lg border border-border bg-white p-3 text-xs leading-5 text-muted-foreground">
        Ask about artifacts, art, music, performance, history, manuscripts, architecture, textiles, or cultural patterns.
      </p>
      <ReadAloudButton text={readAloudText} />
      <ScrollArea className="min-h-0 flex-1 rounded-lg border border-border bg-[#f7f1e7] p-3">
        <div className="space-y-3 pr-2">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <ChatMessage message={message} />
              {message.type === "assistant" ? (
                <QuickActionChips compact onSelect={onChipSelect} />
              ) : null}
            </div>
          ))}
          <ChatMessage
            message={{
              id: "current-source-tip",
              type: "source",
              title: "Current workspace",
              detail: `${workspace.status.sourcesLoaded} sources · ${workspace.status.evidenceCards} evidence cards · ${workspace.status.connectionsMapped} connections`,
            }}
          />
        </div>
      </ScrollArea>
      <QueryInput onSubmit={onSubmitQuery} disabled={loading} />
    </aside>
  );
}
