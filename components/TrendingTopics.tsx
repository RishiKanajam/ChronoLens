"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const topics = [
  { emoji: "🏛️", title: "Greek Mythology in Modern Culture", subtitle: "How ancient myths shape today's stories" },
  { emoji: "🎭", title: "Kabuki Theatre Traditions", subtitle: "Japanese performance art across centuries" },
  { emoji: "🕌", title: "Islamic Geometric Patterns", subtitle: "Mathematics meets sacred art" },
  { emoji: "🎵", title: "Blues to Hip-Hop", subtitle: "The African American musical journey" },
  { emoji: "🏺", title: "Indus Valley Civilization", subtitle: "Ancient urban planning and trade" },
  { emoji: "🎨", title: "Renaissance Art Revolution", subtitle: "From Giotto to Michelangelo" },
  { emoji: "📜", title: "Dead Sea Scrolls", subtitle: "Ancient manuscripts and modern discovery" },
  { emoji: "🧵", title: "West African Kente Cloth", subtitle: "Weaving identity and resistance" },
];

export default function TrendingTopics() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function study(title: string) {
    if (loading) return;
    setLoading(title);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: title, mode: "student", lensType: "topic" }),
      });
      const workspace = (await res.json()) as { id: string };
      router.push(`/workspace/${workspace.id}?tab=study`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-5 pb-14">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        Popular study topics
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <Card
            key={topic.title}
            className="group cursor-pointer transition-colors hover:border-primary/60 hover:bg-card/80"
            onClick={() => study(topic.title)}
          >
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-2xl shrink-0">{topic.emoji}</span>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm leading-5">{topic.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{topic.subtitle}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={loading === topic.title}
              >
                {loading === topic.title ? "…" : "Study this"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
