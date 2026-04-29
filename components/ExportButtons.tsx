"use client";

import { Download, FileText, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportWorkspacePdf } from "@/lib/export/pdf";
import { exportWorkspacePpt } from "@/lib/export/ppt";
import { Workspace } from "@/lib/types";

export default function ExportButtons({ workspace }: { workspace: Workspace }) {
  function downloadSourcePack() {
    const blob = new Blob([JSON.stringify(workspace.sourceRecords, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workspace.id}-sources.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => exportWorkspacePdf(workspace)}>
        <FileText className="h-4 w-4" />Export PDF
      </Button>
      <Button onClick={() => exportWorkspacePpt(workspace)}>
        <Presentation className="h-4 w-4" />Export PPT
      </Button>
      <Button variant="secondary" onClick={downloadSourcePack}>
        <Download className="h-4 w-4" />Download source pack
      </Button>
    </div>
  );
}
