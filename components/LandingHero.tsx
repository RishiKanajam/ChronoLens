"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, BookOpen, Landmark, Network, Search, ShieldCheck } from "lucide-react";
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
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <div className="rounded-xl border border-border bg-card p-5 shadow-soft md:p-7">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-[#fffaf1] px-3 py-2 text-sm font-medium text-primary shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Evidence-first cultural research
            </div>
            <h1 className="mt-5 font-serif text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-[-0.02em] text-foreground">
              ChronoLens
            </h1>
            <p className="mt-4 text-xl font-semibold text-primary md:text-2xl">Cultural Learning + Research OS</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Ask about culture. Explore sources, maps, evidence cards, images, architecture layers, and teaching modules in one clean workspace.
            </p>

            <div className="mt-7 rounded-lg border border-border bg-white p-2 shadow-sm">
              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <div className="flex min-w-0 items-center gap-3 rounded-md bg-[#f7f1e7] px-4">
                  <Search className="h-5 w-5 shrink-0 text-primary" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") analyze(); }}
                    placeholder={placeholders[placeholderIndex]}
                    className="h-12 border-0 bg-transparent px-0 text-base focus-visible:ring-0"
                  />
                </div>
                <Button
                  onClick={() => analyze()}
                  disabled={loading || !query.trim()}
                  size="lg"
                  className="h-12 px-7"
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-[#111315] p-4 text-white sm:row-span-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">Workspace preview</p>
                <span className="rounded-md bg-[#d4a857] px-2 py-1 text-xs font-semibold text-[#111315]">Evidence OS</span>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ["12", "sources"],
                  ["7", "evidence cards"],
                  ["5", "connections"],
                ].map(([value, label]) => (
                  <div key={label} className="flex items-center justify-between rounded-md bg-white/8 px-3 py-3">
                    <span className="text-2xl font-semibold text-[#9ee5dc]">{value}</span>
                    <span className="text-sm text-white/70">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#fffaf1] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Network className="h-4 w-4 text-primary" />
                Pattern bridge
              </div>
              <svg viewBox="0 0 320 145" className="mt-2 h-32 w-full">
                <rect width="320" height="145" rx="8" fill="#f7f1e7" />
                <path d="M58 72 C105 18 214 18 262 72 C212 124 108 124 58 72Z" fill="none" stroke="#ddd5c8" strokeWidth="1" />
                {[
                  [160, 72, 27, "#0f766e", "Topic"],
                  [78, 72, 16, "#b7791f", "Source"],
                  [244, 72, 16, "#0f766e", "Place"],
                  [160, 28, 15, "#7c3aed", "Image"],
                  [160, 118, 15, "#b7791f", "Lesson"],
                ].map(([x, y, r, color, label]) => (
                  <g key={label as string}>
                    <line x1="160" y1="72" x2={x as number} y2={y as number} stroke="#cfc5b6" strokeWidth="1.2" />
                    <circle cx={x as number} cy={y as number} r={r as number} fill={color as string} fillOpacity="0.18" stroke={color as string} strokeWidth="2" />
                    <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#121416">{label as string}</text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-[#fffdf8] p-4">
                <Landmark className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Architecture</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Blueprint layers.</p>
              </div>
              <div className="rounded-lg border border-border bg-[#fffdf8] p-4">
                <Archive className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm font-semibold">Sources</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">OpenAlex, LoC, Met.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Start with a prompt
          </div>
          <ExamplePromptGrid onSelect={(prompt) => analyze(prompt)} />
        </div>
      </div>
    </section>
  );
}
