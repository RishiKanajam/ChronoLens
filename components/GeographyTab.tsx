"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CulturalFlow, GeographyPoint, Workspace } from "@/lib/types";

// ── Mercator projection helper ────────────────────────────────────────────────
function toSVG(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  };
}

// ── Simplified continent paths for 1000×500 Mercator viewBox ─────────────────
// These are rough approximations — sufficient for plotting cultural geography.
const CONTINENTS = [
  // North America
  "M 33,69 L 222,50 L 311,69 L 353,117 L 306,133 L 278,181 L 231,181 L 258,208 L 208,194 L 194,186 L 153,117 L 111,83 Z",
  // South America
  "M 300,217 L 325,222 L 403,250 L 381,319 L 311,403 L 297,389 L 292,300 L 278,250 L 286,228 Z",
  // Greenland
  "M 361,83 L 311,39 L 444,39 L 431,83 Z",
  // Europe
  "M 475,89 L 578,53 L 578,150 L 542,156 L 528,139 L 500,153 L 475,144 L 472,117 Z",
  // Africa
  "M 453,147 L 617,147 L 642,219 L 611,264 L 578,347 L 542,347 L 522,264 L 453,208 Z",
  // Asia (mainland + India peninsula)
  "M 578,144 L 656,144 L 694,106 L 778,56 L 903,69 L 861,139 L 819,189 L 789,247 L 756,225 L 730,215 L 714,250 L 683,228 L 681,181 L 625,217 L 606,147 Z",
  // Australia
  "M 839,300 L 864,283 L 900,289 L 908,356 L 881,350 L 817,317 Z",
  // Japan (island arc)
  "M 880,153 L 892,135 L 895,122 L 893,145 L 878,158 Z",
  // SE Asia islands (very rough)
  "M 795,252 L 820,260 L 840,268 L 820,272 L 800,264 Z",
];

// ── Flow styles ───────────────────────────────────────────────────────────────
const FLOW_STYLES: Record<
  CulturalFlow["flowType"],
  { label: string; color: string; dash: string }
> = {
  trade_route:           { label: "Trade route",             color: "#d4a857", dash: "8 4" },
  colonial_influence:    { label: "Colonial influence",      color: "#ef4444", dash: "4 4" },
  migration:             { label: "Migration pattern",       color: "#22c55e", dash: "6 3" },
  religious_transmission:{ label: "Religious transmission",  color: "#38bdf8", dash: "10 4" },
  artistic_influence:    { label: "Artistic influence",      color: "#d2a8ff", dash: "6 4" },
};

function confidenceLabel(c: number): "High" | "Medium" | "Low" {
  if (c >= 0.8) return "High";
  if (c >= 0.6) return "Medium";
  return "Low";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GeographyTab({ workspace }: { workspace: Workspace }) {
  const points = workspace.geographyPoints ?? [];
  const flows  = workspace.culturalFlows  ?? [];

  const [selected, setSelected] = useState<GeographyPoint | null>(points[0] ?? null);
  const [tooltip, setTooltip]   = useState<{ point: GeographyPoint; x: number; y: number } | null>(null);

  if (!points.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-2xl">🌍</p>
            <p className="text-lg font-semibold text-foreground">No geography data yet</p>
            <p className="text-sm text-muted-foreground leading-6">
              Geography data is generated when <code className="text-primary">OPENAI_API_KEY</code> is set.
              Try the <strong>Lotus Motif demo</strong> which includes sample geography for 6 locations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedFlows = flows.filter(
    (f) => f.from === selected?.id || f.to === selected?.id,
  );

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_320px]">
      {/* ── Main column: map + legend + cards ── */}
      <ScrollArea className="min-h-0">
        <div className="space-y-4 pr-3">

          {/* SVG world map */}
          <div
            className="relative overflow-hidden rounded-2xl border border-border"
            style={{ background: "#101214" }}
          >
            <svg viewBox="0 0 1000 500" className="w-full block select-none">
              {/* Ocean */}
              <rect width="1000" height="500" fill="#101214" />

              {/* Continents */}
              {CONTINENTS.map((d, i) => (
                <path key={i} d={d} fill="#17191c" stroke="#2a2d31" strokeWidth="1.2" />
              ))}

              {/* Cultural flow lines */}
              {flows.map((flow) => {
                const from = points.find((p) => p.id === flow.from);
                const to   = points.find((p) => p.id === flow.to);
                if (!from || !to) return null;
                const f = toSVG(from.lat, from.lng);
                const t = toSVG(to.lat, to.lng);
                const mx = (f.x + t.x) / 2;
                const my = Math.min(f.y, t.y) - Math.abs(t.x - f.x) * 0.22;
                const style  = FLOW_STYLES[flow.flowType];
                const active = selected?.id === flow.from || selected?.id === flow.to;
                return (
                  <path
                    key={flow.id}
                    d={`M ${f.x} ${f.y} Q ${mx} ${my} ${t.x} ${t.y}`}
                    fill="none"
                    stroke={style.color}
                    strokeWidth={active ? 2 : 1}
                    strokeDasharray={style.dash}
                    opacity={active ? 0.85 : 0.28}
                  />
                );
              })}

              {/* Location dots */}
              {points.map((pt) => {
                const { x, y } = toSVG(pt.lat, pt.lng);
                const isSelected = selected?.id === pt.id;
                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(pt)}
                    onMouseEnter={() => setTooltip({ point: pt, x, y })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Animated outer ring */}
                    <circle
                      cx={x} cy={y}
                      r={isSelected ? 16 : 12}
                      fill="none"
                      stroke={isSelected ? "#d4a857" : "#38bdf8"}
                      strokeWidth="1"
                      opacity={isSelected ? 0.7 : 0.35}
                      className="geo-ping"
                    />
                    {/* Main dot */}
                    <circle
                      cx={x} cy={y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? "#d4a857" : "#38bdf8"}
                    />
                    {/* Name label */}
                    <text
                      x={x + 10} y={y - 7}
                      fill={isSelected ? "#d4a857" : "#f5f1e8"}
                      fontSize="10"
                      fontFamily="Arial, sans-serif"
                      fontWeight={isSelected ? "700" : "400"}
                    >
                      {pt.name}
                    </text>
                    {/* Invisible hit area for easier clicking */}
                    <circle cx={x} cy={y} r={20} fill="transparent" />
                  </g>
                );
              })}

              {/* Hover tooltip */}
              {tooltip && (() => {
                const { point, x, y } = tooltip;
                const tx = x > 780 ? x - 192 : x + 14;
                const ty = y > 420 ? y - 80 : y + 12;
                return (
                  <g pointerEvents="none">
                    <rect x={tx - 6} y={ty - 14} width="192" height="64"
                      rx="6" fill="#17191c" stroke="#2a2d31" strokeWidth="1" />
                    <text x={tx + 3} y={ty + 2} fill="#38bdf8" fontSize="11"
                      fontWeight="700" fontFamily="Arial">{point.name}</text>
                    <text x={tx + 3} y={ty + 18} fill="#a9a59b" fontSize="9"
                      fontFamily="Arial">{point.region} · {point.period}</text>
                    <text x={tx + 3} y={ty + 33} fill="#f5f1e8" fontSize="9"
                      fontFamily="Arial">
                      {point.culturalElements.slice(0, 2).join(", ")}
                    </text>
                    <text x={tx + 3} y={ty + 46} fill="#6b7280" fontSize="8"
                      fontFamily="Arial">Click to select</text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Flow type legend */}
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Flow types</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {Object.entries(FLOW_STYLES).map(([type, { label, color, dash }]) => (
                  <div key={type} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg width="28" height="10">
                      <line x1="0" y1="5" x2="28" y2="5"
                        stroke={color} strokeWidth="2" strokeDasharray={dash} />
                    </svg>
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location cards grid */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">All locations</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {points.map((pt) => (
                <Card
                  key={pt.id}
                  className={`cursor-pointer transition-colors ${
                    selected?.id === pt.id
                      ? "ring-2 ring-primary/60 bg-primary/5"
                      : "hover:border-primary/40"
                  }`}
                  onClick={() => setSelected(pt)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-primary leading-5">{pt.name}</p>
                      <Badge variant="muted" className="shrink-0 text-[10px]">{pt.region}</Badge>
                    </div>
                    <p className="text-xs text-accent">{pt.period}</p>
                    <div className="flex flex-wrap gap-1">
                      {pt.culturalElements.slice(0, 3).map((el) => (
                        <Badge key={el} variant="muted" className="text-[10px]">{el}</Badge>
                      ))}
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground/70 line-clamp-2">
                      {pt.significance}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* ── Side panel: selected location details ── */}
      <div className="space-y-4">
        {selected ? (
          <>
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Selected location</p>
                  <h2 className="mt-1 text-xl font-semibold text-primary">{selected.name}</h2>
                  <Badge variant="accent" className="mt-2">{selected.region}</Badge>
                </div>
                <p className="text-sm text-accent font-medium">{selected.period}</p>
                <p className="text-sm leading-6 text-muted-foreground">{selected.significance}</p>
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Cultural elements</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.culturalElements.map((el) => (
                      <Badge key={el} variant="muted">{el}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedFlows.length > 0 && (
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Cultural flows</p>
                  {selectedFlows.map((flow) => {
                    const fromPt = points.find((p) => p.id === flow.from);
                    const toPt   = points.find((p) => p.id === flow.to);
                    const style  = FLOW_STYLES[flow.flowType];
                    const conf   = confidenceLabel(flow.confidence);
                    return (
                      <div key={flow.id} className="rounded-xl border border-border p-3 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold" style={{ color: style.color }}>
                            {style.label}
                          </span>
                          <Badge
                            variant={conf === "High" ? "default" : conf === "Medium" ? "accent" : "muted"}
                            className="text-[10px]"
                          >
                            {conf}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {fromPt?.name} → {toPt?.name}
                        </p>
                        <p className="text-xs font-medium text-foreground">{flow.label}</p>
                        <p className="text-xs leading-5 text-muted-foreground/70 line-clamp-3">
                          {flow.evidence}
                        </p>
                        <div className="flex items-center gap-1">
                          <div
                            className="h-1 rounded-full bg-border flex-1"
                            style={{ background: `linear-gradient(to right, ${style.color} ${flow.confidence * 100}%, transparent ${flow.confidence * 100}%)` }}
                          />
                          <span className="text-[10px] text-muted-foreground">{Math.round(flow.confidence * 100)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                Click a dot on the map or a location card to see details and cultural flows.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
