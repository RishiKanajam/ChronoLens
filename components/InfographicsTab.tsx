"use client";

import { useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workspace } from "@/lib/types";

// ── Download helpers ──────────────────────────────────────────────────────────
async function downloadCardAsPng(cardId: string, filename: string) {
  const { default: html2canvas } = await import("html2canvas");
  const el = document.getElementById(cardId);
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: "#fffdf8", scale: 2 });
  const a = document.createElement("a");
  a.download = `${filename}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

async function downloadAllAsPng(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await downloadCardAsPng(ids[i], `chronolens-infographic-${i + 1}`);
  }
}

// ── Small download icon button ────────────────────────────────────────────────
function CardDownloadBtn({ cardId, filename }: { cardId: string; filename: string }) {
  return (
    <button
      type="button"
      onClick={() => downloadCardAsPng(cardId, filename)}
      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      aria-label="Download card as PNG"
    >
      <Download className="h-3.5 w-3.5" />
    </button>
  );
}

// ── Mini SVG connection map ───────────────────────────────────────────────────
function MiniConnectionMap({ workspace }: { workspace: Workspace }) {
  const nodes = workspace.connectionGraph.nodes.slice(0, 6);
  const cx = 200;
  const cy = 120;
  const radius = 80;
  const center = nodes[0];
  const outer = nodes.slice(1, 6);

  return (
    <svg viewBox="0 0 400 240" className="w-full">
      {outer.map((node, i) => {
        const angle = (i / outer.length) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + radius * Math.cos(angle);
        const ny = cy + radius * Math.sin(angle);
        return (
          <line key={node.id} x1={cx} y1={cy} x2={nx} y2={ny}
            stroke="#0f766e" strokeWidth="1" strokeOpacity="0.4" />
        );
      })}
      {outer.map((node, i) => {
        const angle = (i / outer.length) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + radius * Math.cos(angle);
        const ny = cy + radius * Math.sin(angle);
        return (
          <g key={node.id}>
            <circle cx={nx} cy={ny} r={6} fill="#fffdf8" stroke="#0f766e" strokeWidth="1.5" />
            <text x={nx} y={ny + 18} textAnchor="middle" fill="#6f6759" fontSize="9"
              fontFamily="Arial">{node.label.slice(0, 14)}</text>
          </g>
        );
      })}
      {center && (
        <g>
          <circle cx={cx} cy={cy} r={22} fill="#0f766e" fillOpacity="0.15" stroke="#0f766e" strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fill="#0f766e" fontSize="9"
            fontWeight="700" fontFamily="Arial">{center.label.slice(0, 16)}</text>
        </g>
      )}
    </svg>
  );
}

// ── Confidence dot color ──────────────────────────────────────────────────────
function confColor(c: number) {
  if (c >= 75) return "#22c55e";
  if (c >= 50) return "#fbbf24";
  return "#ef4444";
}

// ── Main component ────────────────────────────────────────────────────────────
export default function InfographicsTab({ workspace }: { workspace: Workspace }) {
  const [regenerated, setRegenerated] = useState(0);
  const cardIds = ["card-facts", "card-timeline", "card-didyouknow", "card-connections"];

  const facts = workspace.evidenceCards.filter((c) => c.classification === "fact").slice(0, 5);
  const allCards = workspace.evidenceCards.slice(0, 3);
  const timeline = workspace.timelineEvents.slice(0, 5);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-5 pr-3 pb-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button onClick={() => downloadAllAsPng(cardIds)}>
            <Download className="h-4 w-4" />Download All as PNG
          </Button>
          <Button variant="secondary" onClick={() => setRegenerated((n) => n + 1)}>
            <RefreshCw className="h-4 w-4" />Regenerate
          </Button>
          <p className="text-xs text-muted-foreground">
            Click any card&apos;s download button to export individually
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">

          {/* Card 1 — Key Facts */}
          <div id="card-facts" className="relative space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
            style={{ borderLeft: "4px solid #0f766e" }}>
            <CardDownloadBtn cardId="card-facts" filename="key-facts" />
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Key Facts
            </p>
            <p className="text-lg font-bold leading-tight text-foreground">{workspace.title}</p>
            <ul className="space-y-2.5 mt-1">
              {(facts.length ? facts : workspace.evidenceCards.slice(0, 5)).map((c, i) => (
                <li key={i} className="flex gap-3 text-sm leading-5">
                  <span style={{ color: "#22c55e" }} className="shrink-0 mt-0.5 text-base">✓</span>
                  <span className="text-muted-foreground">{c.claim}</span>
                </li>
              ))}
              {facts.length === 0 && workspace.evidenceCards.length === 0 && (
                <li className="text-sm text-muted-foreground">No facts available for this workspace.</li>
              )}
            </ul>
            <p className="border-t border-border pt-2 text-xs text-muted-foreground">
              Source-verified · ChronoLens
            </p>
          </div>

          {/* Card 2 — Timeline Snapshot */}
          <div id="card-timeline" className="relative space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
            style={{ borderLeft: "4px solid #b7791f" }}>
            <CardDownloadBtn cardId="card-timeline" filename="timeline-snapshot" />
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Timeline Snapshot
            </p>
            <p className="text-lg font-bold leading-tight text-foreground">{workspace.title}</p>
            <div className="relative pl-5 space-y-0">
              {timeline.map((ev, i) => (
                <div key={ev.id} className="relative">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-0 top-4 bottom-0 w-px"
                      style={{ background: "#ddd5c8", marginLeft: "-1px" }} />
                  )}
                  <div className="flex gap-3 items-start pb-4">
                    <span className="relative z-10 mt-1.5 -ml-1.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-card"
                      style={{ background: confColor(ev.confidence) }} />
                    <div>
                      <p className="text-xs font-semibold text-accent">{ev.dateLabel}</p>
                      <p className="text-sm leading-5 text-muted-foreground">{ev.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="border-t border-border pt-2 text-xs text-muted-foreground">
              Source-verified · ChronoLens
            </p>
          </div>

          {/* Card 3 — Did You Know? */}
          <div id="card-didyouknow" className="relative space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
            style={{ borderLeft: "4px solid #7c3aed" }}>
            <CardDownloadBtn cardId="card-didyouknow" filename="did-you-know" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
              Did You Know?
            </p>
            <p className="text-lg font-bold leading-tight text-foreground">{workspace.title}</p>
            <div className="space-y-3">
              {allCards.map((c, i) => (
                <div key={i} className="space-y-2 rounded-xl border border-border bg-muted p-4">
                  <span className="block text-3xl leading-none text-purple-600/60">&ldquo;</span>
                  <p className="-mt-2 text-sm leading-5 text-muted-foreground">{c.claim}</p>
                  <Badge variant="muted" className="text-[10px]">
                    {c.classification.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="border-t border-border pt-2 text-xs text-muted-foreground">
              Source-verified · ChronoLens
            </p>
          </div>

          {/* Card 4 — Connections Map */}
          <div id="card-connections" className="relative space-y-3 rounded-lg border border-border bg-card p-6 shadow-sm"
            style={{ borderLeft: "4px solid #0f766e" }}>
            <CardDownloadBtn cardId="card-connections" filename="connections-map" />
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              How It Connects
            </p>
            <p className="text-lg font-bold leading-tight text-foreground">{workspace.title}</p>
            <MiniConnectionMap workspace={workspace} key={regenerated} />
            <div className="flex flex-wrap gap-2 pt-1">
              {workspace.connectionGraph.nodes.slice(1, 5).map((n) => (
                <span key={n.id} className="text-xs rounded-full px-2.5 py-1"
                  style={{ background: "#f2eee5", color: "#6f6759" }}>
                  {n.label}
                </span>
              ))}
            </div>
            <p className="border-t border-border pt-2 text-xs text-muted-foreground">
              Source-verified · ChronoLens
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
