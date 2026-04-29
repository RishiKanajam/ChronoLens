"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Archive, Image as ImageIcon, Network, Search, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LensType, UserMode } from "@/lib/types";

const placeholders = [
  "What role did spice trade play in cultural exchange?",
  "How did Buddhist art evolve from India to Japan?",
  "Compare Aboriginal dot painting with African sand art",
];

const fieldPlaceholders: Record<"study" | "teach" | "research", string[]> = {
  study: placeholders,
  teach: [
    "Year 8 lesson on Silk Road trade routes",
    "Teach the Mughal Empire through art and architecture",
    "Year 10 unit on African oral storytelling traditions",
  ],
  research: [
    "Analyze Indus Valley seal iconography",
    "Research the spread of lotus motifs in Buddhist art",
    "Document Kente cloth patterns and their meanings",
  ],
};

export default function CreateWorkspaceForm({
  title, defaultMode, defaultTab, fields,
}: {
  title: string;
  defaultMode: UserMode;
  defaultTab: string;
  fields: "study" | "teach" | "research";
}) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<UserMode>(defaultMode);
  const [lensType, setLensType] = useState<LensType>(fields === "research" ? "artifact" : "topic");
  const [image, setImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function submit() {
    const query = [topic, notes].filter(Boolean).join("\n");
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode, lensType, uploadedImageDataUrl: image }),
      });
      if (!response.ok) throw new Error("Workspace creation failed");
      const workspace = (await response.json()) as { id: string };
      router.push(`/workspace/${workspace.id}?tab=${defaultTab}`);
    } finally {
      setLoading(false);
    }
  }

  function readFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  const currentPlaceholder = fieldPlaceholders[fields][placeholderIndex % fieldPlaceholders[fields].length];

  const previewTiles = [
    { icon: Archive, label: "Sources", value: "OpenAlex, LoC, Met" },
    { icon: Network, label: "Pattern bridge", value: "Graph + relations" },
    { icon: ImageIcon, label: "Image Lab", value: image ? "Upload ready" : "Optional upload" },
  ];

  return (
    <div className="mx-auto grid min-h-[calc(100vh-65px)] w-full max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:px-6">
      <section className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary">ChronoLens research</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h1>
          </div>
          <Button variant="secondary" onClick={() => setTopic(currentPlaceholder)}>
            <Sparkles className="h-4 w-4" />
            Use prompt
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4 md:p-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(); }}
                placeholder={currentPlaceholder}
                className="h-12 text-base"
              />
              <Button className="h-12 px-5" onClick={submit} disabled={loading || !topic.trim()}>
                <Search className="h-4 w-4" />
                {loading ? "Creating..." : fields === "research" ? "Create Workspace" : "Generate"}
              </Button>
            </div>
          {fields === "study" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Select defaultValue="beginner">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={mode} onValueChange={(v) => setMode(v as UserMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields === "teach" && (
            <div className="grid gap-4 md:grid-cols-3">
              <Input placeholder="Class level (e.g. Year 9)" />
              <Select defaultValue="45">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="source">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="source">Source analysis</SelectItem>
                  <SelectItem value="history">Historical thinking</SelectItem>
                  <SelectItem value="visual">Visual culture</SelectItem>
                  <SelectItem value="music">Music/performance study</SelectItem>
                  <SelectItem value="comparison">Cross-cultural comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields === "research" && (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <Select value={lensType} onValueChange={(v) => setLensType(v as LensType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artifact">Artifact / Archaeology</SelectItem>
                    <SelectItem value="visual_art">Visual Art</SelectItem>
                    <SelectItem value="music">Music Study</SelectItem>
                    <SelectItem value="performance">Dance / Performance</SelectItem>
                    <SelectItem value="architecture">Architecture</SelectItem>
                    <SelectItem value="textile">Textile / Pattern</SelectItem>
                    <SelectItem value="manuscript">Manuscript / Literature</SelectItem>
                    <SelectItem value="oral_tradition">Oral Tradition</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="file" accept="image/*" onChange={(e) => readFile(e.target.files?.[0])} className="cursor-pointer" />
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                placeholder="Paste text/source notes, catalog metadata, field observations, or research questions..."
              />
            </>
          )}
        </CardContent>
      </Card>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {previewTiles.map((tile) => (
            <Card key={tile.label} className="bg-white/80">
              <CardContent className="p-4">
                <tile.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">{tile.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{tile.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <aside className="grid content-start gap-3">
        <Card className="bg-[#111315] text-white">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-[#9ee5dc]">Workspace output</p>
            <p className="mt-3 text-2xl font-semibold leading-tight">Evidence, sources, visual regions, graphs, and timelines load into tabs.</p>
            <p className="mt-3 text-sm leading-6 text-white/65">The workspace adapts to screen width and keeps each tool focused instead of dumping the whole report.</p>
          </CardContent>
        </Card>
        {image ? (
          <Card>
            <CardContent className="p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Uploaded preview" className="aspect-[4/3] w-full rounded-lg object-cover" />
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground">What happens next</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Search live source APIs", "Build cautious evidence cards", "Plot pattern connections", "Prepare study and teaching modules"].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
