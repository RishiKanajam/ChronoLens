"use client";

import { useState } from "react";
import ReadAloudButton from "@/components/ReadAloudButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { exportWorkspacePdf } from "@/lib/export/pdf";
import { Workspace } from "@/lib/types";

export default function StudyTab({ workspace }: { workspace: Workspace }) {
  const sm = workspace.studyModule;
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_360px]">
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Start Here</p>
                <div className="flex flex-wrap gap-2">
                  <ReadAloudButton text={sm.overview} />
                  <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(sm, null, 2))}>
                    Copy study notes
                  </Button>
                  <Button size="sm" onClick={() => exportWorkspacePdf(workspace)}>
                    Export study PDF
                  </Button>
                </div>
              </div>
              <div className="text-sm text-foreground whitespace-pre-line" style={{ fontSize: "15px", lineHeight: "1.75" }}>{sm.overview}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="text-xs font-semibold text-primary">Source Detective</p>
              <div className="grid gap-3 md:grid-cols-2">
                {sm.sourceDetectiveClues.map((clue) => (
                  <Card key={clue} className="bg-background/60">
                    <CardContent className="p-3 text-sm leading-6 text-muted-foreground">{clue}</CardContent>
                  </Card>
                ))}
              </div>
              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-accent">Student hypothesis prompt</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Write one possible explanation, name the evidence, and state what would make you change your mind.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-semibold text-primary">What We Know vs What We Infer</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="bg-background/60">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground mb-2">What we know</p>
                    <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
                      {sm.whatWeKnow.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-background/60">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground mb-2">What we infer</p>
                    <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
                      {sm.whatWeInfer.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-semibold text-accent">Key Terms</p>
              {sm.keyTerms.map((term, i) => (
                <div key={term.term}>
                  {i > 0 && <Separator className="mb-3" />}
                  <p className="font-medium text-foreground">{term.term}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{term.definition}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Common Misconceptions</p>
              <ul className="space-y-2">
                {sm.misconceptions.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                    <span className="text-red-400 shrink-0 mt-0.5">✗</span>{item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Quiz</p>
              {sm.quiz.map((item, idx) => (
                <Card key={item.question} className="border border-border">
                  <CardContent className="p-5 space-y-3">
                    <p className="text-sm font-semibold text-foreground">{idx + 1}. {item.question}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRevealed((c) => ({ ...c, [item.question]: !c[item.question] }))}
                    >
                      {revealed[item.question] ? "Hide answer" : "Reveal answer"}
                    </Button>
                    {revealed[item.question] && (
                      <p className="text-sm leading-5 text-muted-foreground">{item.answer}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          {sm.expertsDebate?.length ? (
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>What Experts Are Still Debating</p>
                <ul className="space-y-2">
                  {sm.expertsDebate.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                      <span className="text-purple-400 shrink-0 mt-0.5">⚡</span>{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
