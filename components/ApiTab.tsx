"use client";

import { CheckCircle2, Clipboard } from "lucide-react";
import { useState } from "react";
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

export default function ApiTab({ workspace }: { workspace: Workspace }) {
  const request = { query: workspace.query, mode: workspace.mode, lensType: workspace.lensType };
  const response = {
    id: workspace.id, title: workspace.title, status: workspace.status,
    sourceRecords: workspace.sourceRecords, evidenceCards: workspace.evidenceCards,
    connectionGraph: workspace.connectionGraph, timelineEvents: workspace.timelineEvents,
    studyModule: workspace.studyModule, lessonPack: workspace.lessonPack,
  };
  const json = JSON.stringify(response, null, 2);
  const markdown = `# ${workspace.title}\n\n${workspace.summary}\n\n## Key Questions\n${workspace.keyQuestions.map((q) => `- ${q}`).join("\n")}`;
  const bibliography = workspace.sourceRecords
    .map((s) => `${s.title}. ${s.institution || s.provider}. ${s.dateLabel || ""}`).join("\n");

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-2">
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary">API request</p>
                <CopyButton label="Copy" text={JSON.stringify(request, null, 2)} />
              </div>
              <pre className="max-h-64 overflow-auto rounded-xl bg-background p-4 text-xs leading-5 text-muted-foreground">
                {JSON.stringify(request, null, 2)}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary">API response</p>
                <CopyButton label="Copy" text={json} />
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-xl bg-background p-4 text-xs leading-5 text-muted-foreground">
                {json}
              </pre>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">
          <Card>
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-semibold text-accent">Pipeline status</p>
              {["Query workspace created","Demo sources loaded","Evidence cards linked","Connections mapped","Timeline built","Study module ready","Lesson pack ready"].map((step) => (
                <div key={step} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {step}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-semibold text-accent">Adapter status</p>
              {adapterStatus.map((a) => (
                <div key={a.provider} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="text-foreground">{a.provider}</span>
                  <span className="text-xs text-muted-foreground/60">{a.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-semibold text-accent">Export formats</p>
              <div className="flex flex-wrap gap-2 items-center">
                <CopyButton label="Bibliography" text={bibliography} />
                <CopyButton label="Markdown" text={markdown} />
                <CopyButton label="Lesson pack" text={JSON.stringify(workspace.lessonPack, null, 2)} />
                <CopyButton label="Research dossier" text={workspace.summary} />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
