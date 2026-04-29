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
  const canvas = await html2canvas(el, { backgroundColor: "#0f1115", scale: 2 });
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
      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition"
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
            stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
        );
      })}
      {outer.map((node, i) => {
        const angle = (i / outer.length) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + radius * Math.cos(angle);
        const ny = cy + radius * Math.sin(angle);
        return (
          <g key={node.id}>
            <circle cx={nx} cy={ny} r={6} fill="#1e2028" stroke="#38bdf8" strokeWidth="1.5" />
            <text x={nx} y={ny + 18} textAnchor="middle" fill="#a9a59b" fontSize="9"
              fontFamily="Arial">{node.label.slice(0, 14)}</text>
          </g>
        );
      })}
      {center && (
        <g>
          <circle cx={cx} cy={cy} r={22} fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fill="#38bdf8" fontSize="9"
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
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Card 1 — Key Facts */}
          <div id="card-facts" className="relative rounded-2xl p-6 space-y-4"
            style={{ background: "#0f1115", borderLeft: "4px solid #38bdf8" }}>
            <CardDownloadBtn cardId="card-facts" filename="key-facts" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#38bdf8" }}>
              Key Facts
            </p>
            <p className="text-lg font-bold text-white leading-tight">{workspace.title}</p>
            <ul className="space-y-2.5 mt-1">
              {(facts.length ? facts : workspace.evidenceCards.slice(0, 5)).map((c, i) => (
                <li key={i} className="flex gap-3 text-sm leading-5">
                  <span style={{ color: "#22c55e" }} className="shrink-0 mt-0.5 text-base">✓</span>
                  <span className="text-gray-300">{c.claim}</span>
                </li>
              ))}
              {facts.length === 0 && workspace.evidenceCards.length === 0 && (
                <li className="text-sm text-gray-500">No facts available for this workspace.</li>
              )}
            </ul>
            <p className="text-xs text-gray-600 pt-2 border-t border-white/10">
              Source-verified · ChronoLens
            </p>
          </div>

          {/* Card 2 — Timeline Snapshot */}
          <div id="card-timeline" className="relative rounded-2xl p-6 space-y-4"
            style={{ background: "#0f1115", borderLeft: "4px solid #d4a857" }}>
            <CardDownloadBtn cardId="card-timeline" filename="timeline-snapshot" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#d4a857" }}>
              Timeline Snapshot
            </p>
            <p className="text-lg font-bold text-white leading-tight">{workspace.title}</p>
            <div className="relative pl-5 space-y-0">
              {timeline.map((ev, i) => (
                <div key={ev.id} className="relative">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-0 top-4 bottom-0 w-px"
                      style={{ background: "#1e2028", marginLeft: "-1px" }} />
                  )}
                  <div className="flex gap-3 items-start pb-4">
                    <span className="relative z-10 shrink-0 h-3 w-3 rounded-full mt-1.5 -ml-1.5 ring-2 ring-[#0f1115]"
                      style={{ background: confColor(ev.confidence) }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#d4a857" }}>{ev.dateLabel}</p>
                      <p className="text-sm text-gray-200 leading-5">{ev.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 pt-2 border-t border-white/10">
              Source-verified · ChronoLens
            </p>
          </div>

          {/* Card 3 — Did You Know? */}
          <div id="card-didyouknow" className="relative rounded-2xl p-6 space-y-4"
            style={{ background: "#0f1115", borderLeft: "4px solid #a78bfa" }}>
            <CardDownloadBtn cardId="card-didyouknow" filename="did-you-know" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
              Did You Know?
            </p>
            <p className="text-lg font-bold text-white leading-tight">{workspace.title}</p>
            <div className="space-y-3">
              {allCards.map((c, i) => (
                <div key={i} className="rounded-xl p-4 space-y-2"
                  style={{ background: "#1a1b22", border: "1px solid #2a2b35" }}>
                  <span className="text-3xl text-purple-400/60 leading-none block">&ldquo;</span>
                  <p className="text-sm leading-5 text-gray-300 -mt-2">{c.claim}</p>
                  <Badge variant="muted" className="text-[10px]">
                    {c.classification.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 pt-2 border-t border-white/10">
              Source-verified · ChronoLens
            </p>
          </div>

          {/* Card 4 — Connections Map */}
          <div id="card-connections" className="relative rounded-2xl p-6 space-y-3"
            style={{ background: "#0f1115", borderLeft: "4px solid #38bdf8" }}>
            <CardDownloadBtn cardId="card-connections" filename="connections-map" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#38bdf8" }}>
              How It Connects
            </p>
            <p className="text-lg font-bold text-white leading-tight">{workspace.title}</p>
            <MiniConnectionMap workspace={workspace} key={regenerated} />
            <div className="flex flex-wrap gap-2 pt-1">
              {workspace.connectionGraph.nodes.slice(1, 5).map((n) => (
                <span key={n.id} className="text-xs rounded-full px-2.5 py-1"
                  style={{ background: "#1e2028", color: "#a9a59b" }}>
                  {n.label}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600 pt-2 border-t border-white/10">
              Source-verified · ChronoLens
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
