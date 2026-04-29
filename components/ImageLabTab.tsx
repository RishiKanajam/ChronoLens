"use client";

import { useState } from "react";
import ImageAnalysisViewer from "@/components/ImageAnalysisViewer";
import { VisualRegion, Workspace } from "@/lib/types";

const modes = [
  { id: "original", label: "Original" },
  { id: "enhanced", label: "Enhanced" },
  { id: "boxes", label: "Boxes" },
  { id: "comparison", label: "Comparison" },
] as const;

export default function ImageLabTab({
  workspace,
  onWorkspaceChange,
}: {
  workspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}) {
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("boxes");
  const [selected, setSelected] = useState<VisualRegion>(workspace.visualRegions[0]);

  function createEvidence(region: VisualRegion) {
    setSelected(region);
    const exists = workspace.evidenceCards.some((card) => card.visualRegionId === region.id);
    if (exists) return;
    onWorkspaceChange({
      ...workspace,
      evidenceCards: [
        {
          id: `visual-ev-${region.id}-${Date.now()}`,
          claim: `The ${region.label.toLowerCase()} may support visual evidence for this topic.`,
          classification: "possible_connection",
          evidence: [region.observation],
          sourceIds: [workspace.sourceRecords[0]?.id].filter(Boolean),
          confidence: region.confidence,
          uncertainty: "Generated visual boxes are deterministic for the MVP and require review before final interpretation.",
          counterEvidence: ["A highlighted region alone does not prove cultural meaning."],
          needsExpertReview: true,
          visualRegionId: region.id,
        },
        ...workspace.evidenceCards,
      ],
      status: {
        ...workspace.status,
        evidenceCards: workspace.evidenceCards.length + 1,
      },
    });
  }

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_340px]">
      <section className="min-h-0">
        <div className="mb-4 flex flex-wrap gap-2">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                mode === item.id ? "bg-[#38bdf8] text-[#050607]" : "bg-white/[0.06] text-[#a9a59b]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {mode === "comparison" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <ImageAnalysisViewer workspace={workspace} mode="original" selectedRegionId={selected?.id} onSelectRegion={createEvidence} />
            <ImageAnalysisViewer workspace={workspace} mode="enhanced" selectedRegionId={selected?.id} onSelectRegion={createEvidence} />
          </div>
        ) : (
          <ImageAnalysisViewer workspace={workspace} mode={mode} selectedRegionId={selected?.id} onSelectRegion={createEvidence} />
        )}
      </section>
      <aside className="rounded-3xl bg-white/[0.045] p-5">
        <h2 className="text-xl font-semibold text-white">Visual observations</h2>
        <p className="mt-2 text-sm leading-6 text-vellum/62">
          Click a box to create or open an evidence card linked to that visual region.
        </p>
        <div className="mt-4 rounded-2xl bg-[#101214] p-4">
          <p className="font-semibold text-[#38bdf8]">{selected?.label}</p>
          <p className="mt-2 text-sm leading-6 text-vellum/62">{selected?.observation}</p>
          <p className="mt-3 text-sm text-[#d4a857]">{selected?.confidence}% confidence</p>
        </div>
        <div className="mt-4 space-y-2">
          {workspace.visualRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => createEvidence(region)}
              className={`block w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                selected?.id === region.id
                  ? "bg-[#38bdf8]/15 text-[#38bdf8] ring-1 ring-[#38bdf8]/40"
                  : "bg-white/[0.05] text-vellum/70 hover:bg-white/[0.08]"
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
