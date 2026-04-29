"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Layers3, PlusCircle, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultArchitectureLayers } from "@/lib/contextualFallback";
import { ArchitectureLayer, Workspace } from "@/lib/types";

type BlueprintMode = "blueprint" | "exploded" | "materials";

const modes: Array<{ id: BlueprintMode; label: string }> = [
  { id: "blueprint", label: "Blueprint" },
  { id: "exploded", label: "Exploded" },
  { id: "materials", label: "Materials" },
];

function layerGeometry(layer: ArchitectureLayer, index: number, mode: BlueprintMode) {
  const top = 44;
  const height = mode === "exploded" ? 336 : 380;
  const gap = mode === "exploded" ? 20 : 0;
  const y = top + (layer.yPosition / 100) * height + index * gap;
  const h = Math.max(18, (layer.height / 100) * height);
  return { y, h };
}

export default function ArchitectureTab({
  workspace,
  onWorkspaceChange,
}: {
  workspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}) {
  const layers = useMemo(
    () => (workspace.architectureLayers?.length ? workspace.architectureLayers : defaultArchitectureLayers),
    [workspace.architectureLayers],
  );
  const [mode, setMode] = useState<BlueprintMode>("blueprint");
  const [selectedLayerId, setSelectedLayerId] = useState(layers[0]?.id);
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId) || layers[0];

  useEffect(() => {
    setSelectedLayerId(layers[0]?.id);
  }, [layers]);

  function createEvidenceCard() {
    if (!selectedLayer) return;
    const evidenceId = `arch-ev-${selectedLayer.id}-${Date.now()}`;
    const nextEvidence = {
      id: evidenceId,
      claim: `The ${selectedLayer.name.toLowerCase()} may be an important architectural layer for interpreting ${workspace.title}.`,
      classification: "possible_connection" as const,
      evidence: [
        selectedLayer.description,
        `Material evidence noted: ${selectedLayer.material}. Function: ${selectedLayer.function}`,
      ],
      sourceIds: [workspace.sourceRecords[0]?.id].filter(Boolean),
      confidence: 72,
      uncertainty: "This architectural reading is generated from a simplified study diagram and should be checked against plans, site records, and expert review.",
      counterEvidence: ["A schematic layer alone cannot prove chronology, original use, or cultural meaning."],
      needsExpertReview: true,
    };

    onWorkspaceChange({
      ...workspace,
      evidenceCards: [nextEvidence, ...workspace.evidenceCards],
      status: {
        ...workspace.status,
        evidenceCards: workspace.evidenceCards.length + 1,
      },
    });
  }

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
      <section className="min-w-0 rounded-xl border border-border bg-[#0a0b10] p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#e6f8ff]">
              <Building2 className="h-5 w-5 text-[#38bdf8]" />
              <h2 className="text-lg font-semibold">Architecture analysis</h2>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#9fb3c8]">
              Simplified cross-section for {workspace.title}. Use it as a study aid, not as a measured architectural drawing.
            </p>
          </div>
          <div className="flex rounded-lg border border-[#1e293b] bg-[#101622] p-1">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  mode === item.id
                    ? "bg-[#38bdf8] text-[#061017]"
                    : "text-[#9fb3c8] hover:bg-[#172033] hover:text-[#e6f8ff]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-[#1e293b] bg-[#0a0b10]">
          <svg viewBox="0 0 800 500" className="h-[min(62vh,620px)] min-h-[420px] w-full">
            <rect width="800" height="500" fill="#0a0b10" />
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" stroke="#1a1d25" strokeWidth="1" />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1a1d25" strokeWidth="1" />
            ))}
            <text x="32" y="34" fill="#38bdf8" fontSize="14" fontFamily="Inter, Arial, sans-serif">
              CHRONOLENS BLUEPRINT / {mode.toUpperCase()}
            </text>
            <text x="768" y="34" textAnchor="end" fill="#64748b" fontSize="12" fontFamily="Inter, Arial, sans-serif">
              relative layer heights
            </text>

            {layers.map((layer, index) => {
              const { y, h } = layerGeometry(layer, index, mode);
              const isSelected = selectedLayer?.id === layer.id;
              const fill = mode === "blueprint" ? layer.color : layer.color;
              const stroke = mode === "blueprint" && !isSelected ? "#38bdf8" : layer.color;

              return (
                <g
                  key={layer.id}
                  role="button"
                  aria-label={layer.name}
                  tabIndex={0}
                  onClick={() => setSelectedLayerId(layer.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelectedLayerId(layer.id);
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x="190"
                    y={y}
                    width="410"
                    height={h}
                    fill={fill}
                    fillOpacity={isSelected ? 0.28 : mode === "materials" ? 0.2 : 0.14}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <path d={`M190 ${y} L142 ${y + h / 2} L190 ${y + h}`} fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
                  <text x="32" y={y + h / 2 - 3} fill={isSelected ? "#f8fafc" : "#9fb3c8"} fontSize="13" fontFamily="Inter, Arial, sans-serif">
                    {layer.name}
                  </text>
                  {mode === "materials" ? (
                    <text x="212" y={y + h / 2 + 5} fill="#f8fafc" fontSize="13" fontFamily="Inter, Arial, sans-serif">
                      {layer.material}
                    </text>
                  ) : null}
                  <line x1="635" y1={y} x2="635" y2={y + h} stroke={layer.color} strokeWidth="1.3" />
                  <line x1="625" y1={y} x2="645" y2={y} stroke={layer.color} strokeWidth="1.3" />
                  <line x1="625" y1={y + h} x2="645" y2={y + h} stroke={layer.color} strokeWidth="1.3" />
                  <text x="655" y={y + h / 2 + 4} fill="#7dd3fc" fontSize="11" fontFamily="Inter, Arial, sans-serif">
                    {layer.height}%
                  </text>
                </g>
              );
            })}

            <path d="M190 455H600M190 455v-12M600 455v-12" stroke="#38bdf8" strokeWidth="1.4" />
            <text x="395" y="478" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="Inter, Arial, sans-serif">
              schematic cross-section, not to scale
            </text>
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-[#1e293b] bg-[#101622] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#e6f8ff]">
              <Layers3 className="h-4 w-4 text-[#38bdf8]" />
              {layers.length} layers
            </div>
            <p className="mt-2 text-xs leading-5 text-[#9fb3c8]">From crown details through foundation and substructure.</p>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#101622] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#e6f8ff]">
              <Ruler className="h-4 w-4 text-[#d4a857]" />
              Relative scale
            </div>
            <p className="mt-2 text-xs leading-5 text-[#9fb3c8]">Layer heights are percentages for visual reasoning.</p>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#101622] p-4">
            <div className="text-sm font-semibold text-[#e6f8ff]">Evidence status</div>
            <p className="mt-2 text-xs leading-5 text-[#9fb3c8]">Create evidence cards only after noting uncertainty and review needs.</p>
          </div>
        </div>
      </section>

      <aside className="min-h-0 rounded-xl border border-border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-primary">Selected layer</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-foreground">{selectedLayer?.name}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="accent">{selectedLayer?.material}</Badge>
          <Badge variant="secondary">{selectedLayer?.period}</Badge>
        </div>
        <div className="mt-5 space-y-5 text-sm leading-6 text-muted-foreground">
          <div>
            <p className="mb-1 font-semibold text-foreground">Description</p>
            <p>{selectedLayer?.description}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-foreground">Function</p>
            <p>{selectedLayer?.function}</p>
          </div>
        </div>
        <Button type="button" onClick={createEvidenceCard} className="mt-6 w-full">
          <PlusCircle className="h-4 w-4" />
          Create evidence card
        </Button>
        <div className="mt-5 rounded-lg border border-border bg-[#f7f1e7] p-4 text-sm leading-6 text-muted-foreground">
          This is a structured interpretation aid. Use it to ask better questions about materials, construction logic, patronage, and review needs.
        </div>
      </aside>
    </div>
  );
}
