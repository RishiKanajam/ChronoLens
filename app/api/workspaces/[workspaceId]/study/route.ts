import { NextResponse } from "next/server";
import { regenerateStudy } from "@/lib/workspaceFactory";
import { getWorkspace } from "@/lib/workspaceStore";
import { StudyModule } from "@/lib/types";

interface Params {
  params: {
    workspaceId: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  const workspace = getWorkspace(params.workspaceId);

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as Partial<StudyModule>;
  return NextResponse.json(regenerateStudy(workspace, body));
}
