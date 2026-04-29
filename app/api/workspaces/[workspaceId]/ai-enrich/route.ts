import { NextResponse } from "next/server";
import { enrichWorkspaceWithOpenAI } from "@/lib/ai/openai";
import { getWorkspace, saveWorkspace } from "@/lib/workspaceStore";

interface Params {
  params: { workspaceId: string };
}

export async function POST(_request: Request, { params }: Params) {
  const workspace = getWorkspace(params.workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const enrichment = await enrichWorkspaceWithOpenAI(workspace);
  if (!enrichment) {
    const fallback = saveWorkspace({
      ...workspace,
      status: { ...workspace.status, aiMode: process.env.OPENAI_API_KEY ? "unavailable" : "fallback" },
    });
    return NextResponse.json(fallback);
  }

  return NextResponse.json(
    saveWorkspace({
      ...workspace,
      ...enrichment,
      status: { ...workspace.status, ...enrichment.status },
    }),
  );
}
