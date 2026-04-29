import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/workspaceStore";

interface Params {
  params: { workspaceId: string };
}

export async function POST(_request: Request, { params }: Params) {
  const workspace = getWorkspace(params.workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  return NextResponse.json({
    regions: workspace.visualRegions,
    mode: workspace.status.aiMode,
  });
}
