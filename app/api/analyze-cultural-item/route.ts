import { NextResponse } from "next/server";
import { createWorkspace } from "@/lib/workspaceFactory";
import { LensType, UserMode } from "@/lib/types";

function normalizeMode(mode: unknown): UserMode {
  if (mode === "Teacher") return "teacher";
  if (mode === "Student") return "student";
  if (mode === "Museum Educator") return "museum_educator";
  if (mode === "Researcher") return "researcher";
  if (mode === "teacher" || mode === "student" || mode === "museum_educator" || mode === "researcher") return mode;
  return "researcher";
}

function normalizeLens(lens: unknown): LensType {
  const allowed: LensType[] = [
    "artifact",
    "visual_art",
    "music",
    "performance",
    "architecture",
    "textile",
    "manuscript",
    "oral_tradition",
    "topic",
  ];
  return allowed.includes(lens as LensType) ? (lens as LensType) : "topic";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const workspace = await createWorkspace({
    query: body.researchQuestion || body.title || body.query || "",
    mode: normalizeMode(body.mode),
    lensType: normalizeLens(body.lens),
  });

  return NextResponse.json(workspace);
}
