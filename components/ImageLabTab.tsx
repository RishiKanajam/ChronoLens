"use client";

import { useState } from "react";
import ImageAnalysisViewer from "@/components/ImageAnalysisViewer";
import { VisualRegion, Workspace } from "@/lib/types";

const modes = [
  { id: "original", label: "Original" },
  { id: "enhanced", label: "Enhanced" },
  { id: "boxes", label: "Boxes" },
  { id: "select", label: "Select Area" },
  { id: "comparison", label: "Comparison" },
] as const;

function imageReason(workspace: Workspace) {
  if (workspace.uploadedImageDataUrl) {
    return "Why this image: it is the uploaded source, so boxes and enhancements stay tied to the user's artifact.";
  }
  return `Why this image: ChronoLens generated a topic-specific study plate for ${workspace.title} so the demo can be analyzed even without an upload.`;
}

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

  function createSelectionEvidence(analysis: string) {
    onWorkspaceChange({
      ...workspace,
      evidenceCards: [
        {
          id: `selection-ev-${Date.now()}`,
          claim: `A selected visual region may contain an architectural or artistic element relevant to ${workspace.title}.`,
          classification: "possible_connection",
          evidence: [analysis],
          sourceIds: [workspace.sourceRecords[0]?.id].filter(Boolean),
          confidence: 64,
          uncertainty: "The selected-region analysis is approximate and based on the image area plus topic context; verify against the source image and specialist references.",
          counterEvidence: ["A drawn selection does not prove identity, period, material, or cultural meaning without corroborating sources."],
          needsExpertReview: true,
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
                mode === item.id ? "bg-primary text-primary-foreground" : "border border-border bg-white text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {mode === "comparison" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="space-y-2">
              <div className="rounded-lg border border-border bg-white p-2 shadow-sm">
                <ImageAnalysisViewer workspace={workspace} mode="original" selectedRegionId={selected?.id} onSelectRegion={createEvidence} />
              </div>
              <figcaption className="text-xs leading-5 text-muted-foreground">
                Original view. {imageReason(workspace)}
              </figcaption>
            </figure>
            <figure className="space-y-2">
              <div className="rounded-lg border border-border bg-white p-2 shadow-sm">
                <ImageAnalysisViewer workspace={workspace} mode="enhanced" selectedRegionId={selected?.id} onSelectRegion={createEvidence} />
              </div>
              <figcaption className="text-xs leading-5 text-muted-foreground">
                Enhanced view. Contrast and saturation help students compare visible details before making claims.
              </figcaption>
            </figure>
          </div>
        ) : (
          <figure className="space-y-2">
            <ImageAnalysisViewer
              workspace={workspace}
              mode={mode}
              selectedRegionId={selected?.id}
              onSelectRegion={createEvidence}
              onSaveAnalysisEvidence={createSelectionEvidence}
            />
            <figcaption className="text-xs leading-5 text-muted-foreground">
              {imageReason(workspace)}
            </figcaption>
          </figure>
        )}
      </section>
      <aside className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Visual observations</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Click a box to create an evidence card, or use Select Area to inspect a custom region.
        </p>
        <div className="mt-4 rounded-lg border border-border bg-[#f7f1e7] p-4">
          <p className="font-semibold text-primary">{selected?.label}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected?.observation}</p>
          <p className="mt-3 text-sm text-accent">{selected?.confidence}% confidence</p>
        </div>
        <div className="mt-4 space-y-2">
          {workspace.visualRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => createEvidence(region)}
              className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                selected?.id === region.id
                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "bg-[#f7f1e7] text-muted-foreground hover:bg-secondary"
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
