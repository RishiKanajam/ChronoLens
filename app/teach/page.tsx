"use client";

import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import AppFrame from "@/components/AppFrame";
import LessonStarters, { LessonStarter } from "@/components/LessonStarters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LessonPack, Workspace } from "@/lib/types";
import { exportWorkspacePdf } from "@/lib/export/pdf";
import { exportWorkspacePpt } from "@/lib/export/ppt";
import { createFallbackWorkspace } from "@/lib/contextualFallback";

const placeholders = [
  "Year 8 lesson on Silk Road trade routes",
  "Teach the Mughal Empire through art and architecture",
  "Year 10 unit on African oral storytelling traditions",
];

export default function TeachPage() {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("Year 9");
  const [duration, setDuration] = useState("45 minutes");
  const [learningGoal, setLearningGoal] = useState("source analysis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LessonPack | null>(null);
  const [phIndex, setPhIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhIndex((i) => (i + 1) % placeholders.length), 3000);
    return () => clearInterval(t);
  }, []);

  async function generate(override?: {
    topic?: string;
    classLevel?: string;
    duration?: string;
    learningGoal?: string;
  }) {
    const nextTopic = (override?.topic || topic).trim();
    const nextClassLevel = override?.classLevel || classLevel;
    const nextDuration = override?.duration || duration;
    const nextLearningGoal = override?.learningGoal || learningGoal;
    if (!nextTopic || loading) return;

    setTopic(nextTopic);
    setClassLevel(nextClassLevel);
    setDuration(nextDuration);
    setLearningGoal(nextLearningGoal);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: nextTopic,
          classLevel: nextClassLevel,
          duration: nextDuration,
          learningGoal: nextLearningGoal,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Failed to generate lesson.");
        return;
      }
      setResult((await res.json()) as LessonPack);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function generateStarter(starter: LessonStarter) {
    await generate({
      topic: starter.topic,
      classLevel: starter.year,
      duration: "45 minutes",
      learningGoal: starter.curriculum.toLowerCase().includes("geography")
        ? "comparison across cultures"
        : "source analysis",
    });
  }

  const lesson = result;

  function asWorkspace(): Workspace | null {
    if (!lesson) return null;
    return {
      ...createFallbackWorkspace({ query: topic, mode: "teacher", lensType: "topic" }),
      lessonPack: lesson,
      title: topic,
      summary: lesson.objective,
    };
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-4xl px-5 py-12 space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Create a cultural lesson</h1>
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
              <Button onClick={() => generate()} disabled={loading || !topic.trim()}>
                <Wand2 className="h-4 w-4" />
                {loading ? "Generating…" : "Generate Lesson"}
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={classLevel} onChange={(e) => setClassLevel(e.target.value)} placeholder="Class level" />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {["30 minutes", "45 minutes", "60 minutes", "90 minutes"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {["source analysis", "historical thinking", "visual culture", "music/performance study", "comparison across cultures"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/50">
            <CardContent className="p-4 text-destructive text-sm">{error}</CardContent>
          </Card>
        )}

        {lesson && (
          <div className="space-y-6">
            {/* Export actions */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => { const ws = asWorkspace(); if (ws) exportWorkspacePdf(ws); }}>Export Lesson PDF</Button>
              <Button size="sm" onClick={() => { const ws = asWorkspace(); if (ws) exportWorkspacePpt(ws); }}>Export PPT</Button>
              <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify(lesson, null, 2))}>Copy lesson</Button>
            </div>

            {/* Objective + Starter */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Lesson Objective</p>
                  <p className="text-sm leading-6 text-foreground">{lesson.objective}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Starter Question</p>
                  <p className="text-sm leading-6 text-foreground">{lesson.starterQuestion}</p>
                </CardContent>
              </Card>
            </div>

            {/* Activities */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Classroom Activity</p>
                  <p className="text-sm leading-6 text-muted-foreground">{lesson.activity}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Map / Timeline Activity</p>
                  <p className="text-sm leading-6 text-muted-foreground">{lesson.mapTimelineActivity}</p>
                </CardContent>
              </Card>
            </div>

            {/* Discussion + Quiz */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Discussion Questions</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    {lesson.discussionQuestions.map((q, i) => (
                      <li key={i} className="text-sm leading-5 text-muted-foreground">{q}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Quiz Questions</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    {lesson.quizQuestions.map((q, i) => (
                      <li key={i} className="text-sm leading-5 text-muted-foreground">{q}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Rubric + Homework */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Rubric</p>
                  <ul className="space-y-2">
                    {lesson.rubric.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                        <span className="text-green-500 shrink-0">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Homework & Extension</p>
                  <p className="text-sm leading-6 text-muted-foreground">{lesson.homework}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{lesson.extensionActivity}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!result && !loading && (
          <>
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs text-muted-foreground">or pick a topic below</span>
              <div className="flex-1 border-t border-border" />
            </div>
            <LessonStarters onGenerate={generateStarter} />
          </>
        )}
      </div>
    </AppFrame>
  );
}
