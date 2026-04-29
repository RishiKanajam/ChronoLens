import { notFound } from "next/navigation";
import ChronoWorkspaceShell from "@/components/ChronoWorkspaceShell";
import { getWorkspace } from "@/lib/workspaceStore";

interface PageProps {
  params: {
    workspaceId: string;
  };
  searchParams?: {
    tab?: string;
  };
}

export default function WorkspacePage({ params, searchParams }: PageProps) {
  const workspace = getWorkspace(params.workspaceId);

  if (!workspace) {
    notFound();
  }

  return <ChronoWorkspaceShell initialWorkspace={workspace} initialTab={searchParams?.tab} />;
}
