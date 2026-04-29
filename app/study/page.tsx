"use client";

import { useEffect, useState } from "react";
import AppFrame from "@/components/AppFrame";
import ReadAloudButton from "@/components/ReadAloudButton";
import TrendingTopics from "@/components/TrendingTopics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StudyModule, Workspace } from "@/lib/types";
import { exportWorkspacePdf } from "@/lib/export/pdf";
import { createFallbackWorkspace } from "@/lib/contextualFallback";

const placeholders = [
  "What role did spice trade play in cultural exchange?",
  "How did Buddhist art evolve from India to Japan?",
  "Compare Aboriginal dot painting with African sand art",
];

export default function StudyPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [mode, setMode] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudyModule | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [phIndex, setPhIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhIndex((i) => (i + 1) % placeholders.length), 3000);
    return () => clearInterval(t);
  }, []);

  async function generate() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, mode }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Failed to generate study module.");
        return;
      }
      setResult((await res.json()) as StudyModule);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sm = result;

  function asWorkspace(): Workspace | null {
    if (!sm) return null;
    return {
      ...createFallbackWorkspace({ query: topic, mode: "student", lensType: "topic" }),
      studyModule: sm,
      title: topic,
      summary: sm.overview,
    };
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-4xl px-5 py-12 space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Study a cultural topic</h1>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex gap-3">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") generate(); }}
                placeholder={placeholders[phIndex]}
                className="flex-1"
              />
              <Button onClick={generate} disabled={loading || !topic.trim()}>
                {loading ? "Generating…" : "Generate Study Module"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={difficulty === item ? "default" : "secondary"}
                  onClick={() => setDifficulty(item)}
                >
                  {item}
                </Button>
              ))}
              {["Student", "Researcher"].map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={mode === item ? "default" : "ghost"}
                  onClick={() => setMode(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/50">
            <CardContent className="p-4 text-destructive text-sm">{error}</CardContent>
          </Card>
        )}

        {sm && (
          <div className="space-y-6">
            {/* Export actions */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => { const ws = asWorkspace(); if (ws) exportWorkspacePdf(ws); }}>Export Study PDF</Button>
              <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(sm.overview + "\n\n" + sm.whatWeKnow.join("\n"))}>Copy Study Notes</Button>
              <ReadAloudButton text={`${sm.overview} ${sm.whatWeKnow.join(". ")}`} />
            </div>

            {/* Overview */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Start Here</p>
                <div className="text-base leading-relaxed text-foreground whitespace-pre-line" style={{ fontSize: "16px", lineHeight: "1.7" }}>
                  {sm.overview}
                </div>
              </CardContent>
            </Card>

            {/* Know vs Infer */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">What We Know</p>
                  <ul className="space-y-2">
                    {sm.whatWeKnow.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-5">
                        <span className="shrink-0 text-green-500 mt-0.5">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">What We Infer</p>
                  <ul className="space-y-2">
                    {sm.whatWeInfer.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-5">
                        <span className="shrink-0 text-yellow-500 mt-0.5">→</span>{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Key Terms */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Key Terms</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {sm.keyTerms.map((t) => (
                  <Card key={t.term}>
                    <CardContent className="p-4">
                      <p className="font-semibold text-foreground text-sm">{t.term}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.definition}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Source Detective */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Source Detective</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sm.sourceDetectiveClues.map((clue, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 text-sm leading-6 text-muted-foreground">{clue}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quiz */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Quiz</p>
                {sm.quiz.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border p-5 space-y-3">
                    <p className="text-sm font-semibold text-foreground">{i + 1}. {item.question}</p>
                    <Button size="sm" variant="ghost" onClick={() => setRevealed((r) => ({ ...r, [item.question]: !r[item.question] }))}>
                      {revealed[item.question] ? "Hide answer" : "Reveal answer"}
                    </Button>
                    {revealed[item.question] && <p className="text-sm leading-5 text-muted-foreground">{item.answer}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Misconceptions */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Common Misconceptions</p>
                <ul className="space-y-2">
                  {sm.misconceptions.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-5">
                      <span className="shrink-0 text-red-400 mt-0.5">✗</span>{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {!result && !loading && (
          <>
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground">or pick a topic below</span>
              <div className="flex-1 border-t border-border" />
            </div>
            <TrendingTopics />
          </>
        )}
      </div>
    </AppFrame>
  );
}
