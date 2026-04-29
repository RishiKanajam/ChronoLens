"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [lensType, setLensType] = useState<LensType>("topic");
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
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, mode, lensType, uploadedImageDataUrl: image }),
    });
    const workspace = (await response.json()) as { id: string };
    router.push(`/workspace/${workspace.id}?tab=${defaultTab}`);
  }

  function readFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  const currentPlaceholder = fieldPlaceholders[fields][placeholderIndex % fieldPlaceholders[fields].length];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-foreground">{title}</h1>
      <Card className="mt-6">
        <CardContent className="p-5 space-y-4">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(); }}
            placeholder={currentPlaceholder}
          />
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
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Paste text/source notes…"
              />
            </>
          )}
          <Button className="w-full" onClick={submit} disabled={loading || !topic.trim()}>
            {loading ? "Creating…" : fields === "teach" ? "Generate Lesson" : fields === "research" ? "Create Research Workspace" : "Generate Study Module"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
