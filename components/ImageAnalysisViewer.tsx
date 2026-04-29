"use client";

import { VisualRegion, Workspace } from "@/lib/types";

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function ImageAnalysisViewer({
  workspace,
  mode,
  selectedRegionId,
  onSelectRegion,
}: {
  workspace: Workspace;
  mode: "original" | "enhanced" | "boxes";
  selectedRegionId?: string;
  onSelectRegion: (region: VisualRegion) => void;
}) {
  const src =
    workspace.uploadedImageDataUrl ||
    (workspace.generatedImageSvg ? svgDataUrl(workspace.generatedImageSvg) : "");
  const imageClass =
    mode === "enhanced"
      ? "contrast-125 brightness-110 saturate-125"
      : "";

  return (
    <div className="relative aspect-[10/7] overflow-hidden rounded-3xl bg-[#101214] ring-1 ring-[#2a2d31]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="ChronoLens visual analysis source" className={`h-full w-full object-cover ${imageClass}`} />
      {mode === "boxes" &&
        workspace.visualRegions.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelectRegion(region)}
            className={`absolute rounded-lg border-2 text-left transition ${
              selectedRegionId === region.id
                ? "border-[#38bdf8] bg-[#38bdf8]/20"
                : "border-[#d4a857] bg-[#d4a857]/10 hover:bg-[#d4a857]/18"
            }`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
          >
            <span className="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-[#101214] px-2 py-1 text-xs text-[#f5f1e8]">
              {region.label}
            </span>
          </button>
        ))}
    </div>
  );
}
