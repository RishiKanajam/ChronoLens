import { redirect } from "next/navigation";

interface PageProps {
  params: {
    artifactId: string;
  };
}

export default function ArtifactRedirect({ params }: PageProps) {
  redirect(`/workspace/${params.artifactId}`);
}
