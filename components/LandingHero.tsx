"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExamplePromptGrid from "@/components/ExamplePromptGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const placeholders = [
  "What role did spice trade play in cultural exchange?",
  "How did Buddhist art evolve from India to Japan?",
  "Compare Aboriginal dot painting with African sand art",
];

export default function LandingHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function analyze(nextQuery = query) {
    if (!nextQuery.trim() || loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: nextQuery, mode: "student", lensType: "topic" }),
      });
      const workspace = (await response.json()) as { id: string };
      router.push(`/workspace/${workspace.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl flex-col items-center justify-center px-5 py-14 text-center">
      <h1 className="font-serif text-6xl text-foreground md:text-8xl">ChronoLens</h1>
      <p className="mt-3 text-xl text-primary">Cultural Learning + Research OS</p>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
        Ask about culture, artifacts, music, performance, history, and patterns. ChronoLens builds evidence-backed study and teaching modules.
      </p>
      <div className="mt-8 flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card p-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") analyze(); }}
          placeholder={placeholders[placeholderIndex]}
          className="border-0 bg-transparent focus-visible:ring-0 flex-1 text-base"
        />
        <Button
          onClick={() => analyze()}
          disabled={loading || !query.trim()}
          size="lg"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </Button>
      </div>
      <div className="mt-8 w-full">
        <ExamplePromptGrid onSelect={(prompt) => analyze(prompt)} />
      </div>
    </section>
  );
}
