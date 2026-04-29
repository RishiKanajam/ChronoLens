"use client";

import { useEffect, useState } from "react";
import ChronoWorkspaceShell from "@/components/ChronoWorkspaceShell";
import { Workspace } from "@/lib/types";

interface PageProps {
  params: {
    workspaceId: string;
  };
  searchParams?: {
    tab?: string;
  };
}

export default function WorkspacePage({ params, searchParams }: PageProps) {
  const { workspaceId } = params;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`workspace-${workspaceId}`);
    if (stored) {
      setWorkspace(JSON.parse(stored) as Workspace);
      return;
    }
    fetch(`/api/workspaces/${workspaceId}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json() as Promise<Workspace>;
      })
      .then((data) => setWorkspace(data))
      .catch(() => setError(true));
  }, [workspaceId]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Workspace not found.</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Loading workspace…</p>
      </div>
    );
  }

  return <ChronoWorkspaceShell initialWorkspace={workspace} initialTab={searchParams?.tab} />;
}
