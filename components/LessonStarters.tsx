"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const lessons = [
  { year: "Year 7", topic: "Mesopotamian Writing Systems", curriculum: "History & Literacy" },
  { year: "Year 8", topic: "Silk Road Cultural Exchange", curriculum: "Geography & Trade" },
  { year: "Year 9", topic: "Aboriginal Dreaming Stories", curriculum: "First Nations & Identity" },
  { year: "Year 10", topic: "Mughal Architecture", curriculum: "Art & Empire" },
  { year: "Year 11", topic: "African Diaspora Music", curriculum: "Music & Social Change" },
  { year: "Year 12", topic: "Buddhist Art Across Asia", curriculum: "Religion & Visual Culture" },
];

export default function LessonStarters() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function generateLesson(topic: string) {
    if (loading) return;
    setLoading(topic);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: topic, mode: "teacher", lensType: "topic" }),
      });
      const workspace = (await res.json()) as { id: string };
      router.push(`/workspace/${workspace.id}?tab=teach`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-5 pb-14">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <BookOpen className="h-4 w-4 text-primary" />
        Ready-made lesson starters
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card
            key={lesson.topic}
            className="group cursor-pointer transition-colors hover:border-primary/60 hover:bg-card/80"
            onClick={() => generateLesson(lesson.topic)}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-xs">{lesson.year}</Badge>
                <span className="text-xs text-muted-foreground/60">{lesson.curriculum}</span>
              </div>
              <p className="font-medium text-sm text-foreground leading-5">{lesson.topic}</p>
              <Button
                size="sm"
                variant="ghost"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                disabled={loading === lesson.topic}
              >
                {loading === lesson.topic ? "Generating…" : "Use this lesson"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
