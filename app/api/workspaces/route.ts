import { NextResponse } from "next/server";
import { createWorkspace } from "@/lib/workspaceFactory";
import { CreateWorkspaceRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateWorkspaceRequest;
    const workspace = await createWorkspace(body);
    return NextResponse.json(workspace);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Could not create ChronoLens workspace.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
