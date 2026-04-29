import { NextResponse } from "next/server";
import { addEvidenceFromSource } from "@/lib/workspaceStore";

interface Params {
  params: { workspaceId: string };
}

export async function POST(request: Request, { params }: Params) {
  const body = (await request.json().catch(() => ({}))) as { sourceId?: string };
  if (!body.sourceId) return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
  const workspace = addEvidenceFromSource(params.workspaceId, body.sourceId);
  if (!workspace) return NextResponse.json({ error: "Workspace or source not found" }, { status: 404 });
  return NextResponse.json(workspace);
}
