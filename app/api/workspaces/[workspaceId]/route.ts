import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/workspaceStore";

interface Params {
  params: {
    workspaceId: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const workspace = getWorkspace(params.workspaceId);

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  return NextResponse.json(workspace);
}
