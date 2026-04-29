import AppFrame from "@/components/AppFrame";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";

export default function ResearchPage() {
  return (
    <AppFrame>
      <CreateWorkspaceForm title="Research an object or source" defaultMode="researcher" defaultTab="atlas" fields="research" />
    </AppFrame>
  );
}
