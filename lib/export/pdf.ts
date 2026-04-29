import { Workspace } from "@/lib/types";

export async function exportWorkspacePdf(workspace: Workspace) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 44;
  let y = margin;

  function line(text: string, size = 10, gap = 16) {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 508);
    doc.text(lines, margin, y);
    y += lines.length * gap;
    if (y > 760) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setTextColor(20, 20, 20);
  line("ChronoLens", 24, 28);
  line(workspace.title, 18, 22);
  line(workspace.summary, 11, 16);
  line("Key Terms", 14, 20);
  workspace.studyModule.keyTerms.forEach((term) => line(`${term.term}: ${term.definition}`));
  line("Top Sources", 14, 20);
  workspace.sourceRecords.slice(0, 5).forEach((source) => line(`${source.title} - ${source.institution || source.provider}`));
  line("Evidence Cards", 14, 20);
  workspace.evidenceCards.slice(0, 6).forEach((card) => line(`${card.classification}: ${card.claim} (${card.confidence}%)`));
  line("Timeline", 14, 20);
  workspace.timelineEvents.forEach((event) => line(`${event.dateLabel}: ${event.title}`));
  line("Study Module", 14, 20);
  line(workspace.studyModule.overview);
  line("Lesson Outline", 14, 20);
  line(workspace.lessonPack.objective);
  line(workspace.lessonPack.activity);
  doc.save(`${workspace.id}.pdf`);
}
