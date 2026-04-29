"use client";

import { CheckCircle2, Clipboard, Wand2 } from "lucide-react";
import { useState } from "react";
import ExportButtons from "@/components/ExportButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adapterStatus } from "@/lib/sourceSearch";
import { Workspace } from "@/lib/types";

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export default function ExportTab({ workspace, onWorkspaceChange }: {
  workspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}) {
  const [enriching, setEnriching] = useState(false);
  const json = JSON.stringify(workspace, null, 2);
  const bibliography = workspace.sourceRecords
    .map((s) => `${s.title}. ${s.institution || s.provider}. ${s.dateLabel || ""}`)
    .join("\n");

  async function aiEnrich() {
    setEnriching(true);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}/ai-enrich`, { method: "POST" });
      if (res.ok) onWorkspaceChange((await res.json()) as Workspace);
    } finally {
      setEnriching(false);
    }
  }

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_380px]">
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Exports</h2>
              <p className="text-sm leading-6 text-muted-foreground">Download a clean summary, presentation, or source pack.</p>
              <ExportButtons workspace={workspace} />
              <div className="flex flex-wrap gap-2">
                <CopyButton label="Copy summary" text={workspace.summary} />
                <CopyButton label="Copy JSON" text={json} />
                <CopyButton label="Copy lesson" text={JSON.stringify(workspace.lessonPack, null, 2)} />
                <CopyButton label="Copy study notes" text={JSON.stringify(workspace.studyModule, null, 2)} />
                <CopyButton label="Copy bibliography" text={bibliography} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">API response</h3>
                <CopyButton label="Copy JSON" text={json} />
              </div>
              <pre className="max-h-[460px] overflow-auto rounded-xl bg-background p-4 text-xs leading-5 text-muted-foreground">
                {json}
              </pre>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-foreground">AI and pipeline status</h3>
              <p className="text-sm text-muted-foreground">Current mode: <Badge variant={workspace.status.aiMode === "enriched" ? "default" : "muted"}>{workspace.status.aiMode}</Badge></p>
              <Button className="w-full" onClick={aiEnrich} disabled={enriching}>
                <Wand2 className="h-4 w-4" />{enriching ? "Enriching…" : "AI Enrich"}
              </Button>
              <div className="space-y-2">
                {["Workspace created", "Sources loaded", "Evidence linked", "Image regions ready", "Study and lesson exports ready"].map((step) => (
                  <Card key={step} className="bg-background/60">
                    <CardContent className="px-4 py-3 text-sm text-muted-foreground">{step}</CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="text-base font-semibold text-foreground">Adapters</h3>
              <div className="space-y-2">
                {adapterStatus.map((adapter) => (
                  <div key={adapter.provider} className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm">
                    <span className="text-foreground">{adapter.provider}</span>
                    <span className="text-muted-foreground/60 text-xs">{adapter.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
