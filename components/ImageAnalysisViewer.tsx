"use client";

import { type MouseEvent, useRef, useState } from "react";
import { VisualRegion, Workspace } from "@/lib/types";

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

type ImageLabMode = "original" | "enhanced" | "boxes" | "select";
type Point = { x: number; y: number };

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

export default function ImageAnalysisViewer({
  workspace,
  mode,
  selectedRegionId,
  onSelectRegion,
  onSaveAnalysisEvidence,
}: {
  workspace: Workspace;
  mode: ImageLabMode;
  selectedRegionId?: string;
  onSelectRegion: (region: VisualRegion) => void;
  onSaveAnalysisEvidence?: (analysis: string) => void;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Point | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);
  const [selectionResult, setSelectionResult] = useState<string | null>(null);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const src =
    workspace.uploadedImageDataUrl ||
    (workspace.generatedImageSvg ? svgDataUrl(workspace.generatedImageSvg) : "");
  const imageClass =
    mode === "enhanced"
      ? "contrast-125 brightness-110 saturate-125"
      : "";

  function pointFromEvent(e: MouseEvent<HTMLDivElement>): Point | null {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clampPercent(((e.clientX - rect.left) / rect.width) * 100),
      y: clampPercent(((e.clientY - rect.top) / rect.height) * 100),
    };
  }

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    if (mode !== "select") return;
    const point = pointFromEvent(e);
    if (!point) return;
    setSelectionStart(point);
    setSelectionEnd(point);
    setSelectionResult(null);
    setIsSelecting(true);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (mode !== "select" || !isSelecting) return;
    const point = pointFromEvent(e);
    if (point) setSelectionEnd(point);
  }

  async function handleMouseUp() {
    if (mode !== "select" || !isSelecting || !selectionStart || !selectionEnd) return;
    setIsSelecting(false);

    const x1 = Math.min(selectionStart.x, selectionEnd.x);
    const y1 = Math.min(selectionStart.y, selectionEnd.y);
    const x2 = Math.max(selectionStart.x, selectionEnd.x);
    const y2 = Math.max(selectionStart.y, selectionEnd.y);
    if (Math.abs(x2 - x1) < 2 || Math.abs(y2 - y1) < 2) return;

    setSelectionLoading(true);
    setSelectionResult(null);
    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/analyze-region`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x1, y1, x2, y2, topic: workspace.title }),
      });
      const data = (await response.json()) as { analysis?: string };
      setSelectionResult(data.analysis || "ChronoLens could not analyze this region. Try selecting a larger area.");
    } catch {
      setSelectionResult("Region analysis is unavailable right now. The drawn area is still useful as a visual evidence note.");
    } finally {
      setSelectionLoading(false);
    }
  }

  const hasSelection = selectionStart && selectionEnd;
  const selectionBox = hasSelection
    ? {
        left: Math.min(selectionStart.x, selectionEnd.x),
        top: Math.min(selectionStart.y, selectionEnd.y),
        width: Math.abs(selectionEnd.x - selectionStart.x),
        height: Math.abs(selectionEnd.y - selectionStart.y),
      }
    : null;
  const popupLeft = hasSelection ? Math.min(68, Math.max(2, Math.max(selectionStart.x, selectionEnd.x) + 1)) : 2;
  const popupTop = hasSelection ? Math.min(76, Math.max(2, Math.min(selectionStart.y, selectionEnd.y))) : 2;

  return (
    <div
      ref={imageRef}
      className={`relative aspect-[10/7] overflow-hidden rounded-xl bg-white ring-1 ring-border shadow-soft ${
        mode === "select" ? "cursor-crosshair select-none" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="ChronoLens visual analysis source"
        draggable={false}
        className={`h-full w-full object-cover ${imageClass}`}
      />
      {mode === "boxes" &&
        workspace.visualRegions.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelectRegion(region)}
            className={`absolute rounded-lg border-2 text-left transition ${
              selectedRegionId === region.id
                ? "border-primary bg-primary/20"
                : "border-accent bg-accent/10 hover:bg-accent/20"
            }`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
          >
            <span className="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background">
              {region.label}
            </span>
          </button>
        ))}
      {mode === "select" && selectionBox ? (
        <div
          className="pointer-events-none absolute border-2 border-dashed border-[#38bdf8] bg-[#38bdf8]/10"
          style={{
            left: `${selectionBox.left}%`,
            top: `${selectionBox.top}%`,
            width: `${selectionBox.width}%`,
            height: `${selectionBox.height}%`,
          }}
        />
      ) : null}
      {mode === "select" && (selectionLoading || selectionResult) ? (
        <div
          className="absolute z-50 max-w-[300px] rounded-lg border border-[#38bdf8] bg-[#101214] p-4 shadow-xl"
          style={{
            left: `${popupLeft}%`,
            top: `${popupTop}%`,
          }}
        >
          <p className="m-0 text-sm leading-5 text-[#f5f1e8]">
            {selectionLoading ? "Analyzing selected region..." : selectionResult}
          </p>
          {selectionResult ? (
            <button
              type="button"
              onClick={() => onSaveAnalysisEvidence?.(selectionResult)}
              className="mt-3 rounded-md bg-[#38bdf8] px-3 py-1.5 text-sm font-semibold text-[#050607] transition hover:bg-[#7dd3fc]"
            >
              Save as Evidence
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
