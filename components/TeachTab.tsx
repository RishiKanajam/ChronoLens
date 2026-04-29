"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exportWorkspacePdf } from "@/lib/export/pdf";
import { exportWorkspacePpt } from "@/lib/export/ppt";
import { Workspace } from "@/lib/types";

function LessonCard({ label, children, accent = false }: { label: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-2">
        <p className={`text-xs font-semibold ${accent ? "text-accent" : "text-primary"}`}>{label}</p>
        {children}
      </CardContent>
    </Card>
  );
}

export default function TeachTab({ workspace, onWorkspaceChange }: {
  workspace: Workspace;
  onWorkspaceChange?: (workspace: Workspace) => void;
}) {
  const [level, setLevel] = useState("Middle school");
  const [duration, setDuration] = useState("45 minutes");
  const [goal, setGoal] = useState("Separate observation from interpretation");
  const [angle, setAngle] = useState("World cultures / art history");
  const lesson = workspace.lessonPack;

  async function regenerateLesson() {
    const response = await fetch(`/api/workspaces/${workspace.id}/lesson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objective: `${lesson.objective} (${level}, ${duration}, ${goal})` }),
    });
    if (response.ok) onWorkspaceChange?.((await response.json()) as Workspace);
  }

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <CardContent className="p-5 space-y-4">
          <p className="text-xs font-semibold text-primary">Teacher inputs</p>
          {([["Class level", level, setLevel], ["Duration", duration, setDuration],
            ["Learning goal", goal, setGoal], ["Curriculum angle", angle, setAngle]] as const).map(([label, value, setter]) => (
            <label key={label} className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Input value={value} onChange={(e) => (setter as (v: string) => void)(e.target.value)} />
            </label>
          ))}
          <Button className="w-full" onClick={regenerateLesson}>
            <Wand2 className="h-4 w-4" />Regenerate lesson
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigator.clipboard.writeText(JSON.stringify(lesson, null, 2))}>
            Copy lesson
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => exportWorkspacePdf(workspace)}>
            Export PDF
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => exportWorkspacePpt(workspace)}>
            Export PPT
          </Button>
          <p className="text-xs text-muted-foreground/60">Teachers can build this from a topic alone. Uploads optional.</p>
        </CardContent>
      </Card>
      <ScrollArea className="min-h-0">
        <div className="grid gap-3 pr-3 lg:grid-cols-2">
          <LessonCard label="Lesson objective" accent><p className="text-sm leading-6 text-muted-foreground lg:col-span-2">{lesson.objective}</p></LessonCard>
          <LessonCard label="Starter question" accent><p className="text-sm leading-6 text-muted-foreground">{lesson.starterQuestion}</p></LessonCard>
          <LessonCard label="Source pack" accent><p className="text-sm leading-6 text-muted-foreground">{workspace.sourceRecords.slice(0, 4).map((s) => s.title).join("; ")}</p></LessonCard>
          <LessonCard label="Classroom activity"><p className="text-sm leading-6 text-muted-foreground">{lesson.activity}</p></LessonCard>
          <LessonCard label="Map/timeline activity"><p className="text-sm leading-6 text-muted-foreground">{lesson.mapTimelineActivity}</p></LessonCard>
          <LessonCard label="Discussion questions">
            <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
              {lesson.discussionQuestions.map((q) => <li key={q}>{q}</li>)}
            </ul>
          </LessonCard>
          <LessonCard label="Quiz questions">
            <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
              {lesson.quizQuestions.map((q) => <li key={q}>{q}</li>)}
            </ul>
          </LessonCard>
          <LessonCard label="Rubric" accent>
            <ul className="space-y-2 text-sm leading-5 text-muted-foreground">
              {lesson.rubric.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </LessonCard>
          <LessonCard label="Homework and extension" accent>
            <p className="text-sm leading-6 text-muted-foreground">{lesson.homework}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.extensionActivity}</p>
          </LessonCard>
        </div>
      </ScrollArea>
    </div>
  );
}
