import { Workspace } from "@/lib/types";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slideXml(title: string, lines: string[]) {
  const body = lines.slice(0, 10).map(escapeXml).join("\n");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>
    <p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="457200" y="365760"/><a:ext cx="11277600" cy="731520"/></a:xfrm></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="3200" b="1"><a:solidFill><a:srgbClr val="F5F1E8"/></a:solidFill></a:rPr><a:t>${escapeXml(title)}</a:t></a:r></a:p></p:txBody></p:sp>
    <p:sp><p:nvSpPr><p:cNvPr id="3" name="Body"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="609600" y="1371600"/><a:ext cx="10972800" cy="5486400"/></a:xfrm></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="1800"><a:solidFill><a:srgbClr val="A9A59B"/></a:solidFill></a:rPr><a:t>${body}</a:t></a:r></a:p></p:txBody></p:sp>
  </p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

export async function exportWorkspacePpt(workspace: Workspace) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const slides = [
    ["ChronoLens", [workspace.title, workspace.summary]],
    ["Overview", workspace.keyQuestions],
    ["Key Sources", workspace.sourceRecords.slice(0, 5).map((source) => source.title)],
    ["Evidence Cards", workspace.evidenceCards.slice(0, 6).map((card) => `${card.classification}: ${card.claim}`)],
    ["Pattern Connections", workspace.connectionGraph.edges.slice(0, 7).map((edge) => `${edge.label}: ${edge.confidence}%`)],
    ["Timeline", workspace.timelineEvents.map((event) => `${event.dateLabel}: ${event.title}`)],
    ["Study Module", [workspace.studyModule.overview, ...workspace.studyModule.keyTerms.map((term) => `${term.term}: ${term.definition}`)]],
    ["Teacher Lesson Pack", [workspace.lessonPack.objective, workspace.lessonPack.activity, workspace.lessonPack.homework]],
    ["Image Analysis", workspace.visualRegions.map((region) => `${region.label}: ${region.observation}`)],
    ["Caution / Expert Review", workspace.evidenceCards.filter((card) => card.needsExpertReview).map((card) => card.claim)],
  ];

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>${slides.map((_, index) => `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.folder("_rels")?.file(".rels", `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.folder("ppt")?.file("presentation.xml", `<?xml version="1.0" encoding="UTF-8"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldIdLst>${slides.map((_, index) => `<p:sldId id="${256 + index}" r:id="rId${index + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  zip.folder("ppt")?.folder("_rels")?.file("presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slides.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index + 1}.xml"/>`).join("")}</Relationships>`);
  const slideFolder = zip.folder("ppt")?.folder("slides");
  slides.forEach(([title, lines], index) => {
    slideFolder?.file(`slide${index + 1}.xml`, slideXml(title as string, lines as string[]));
  });

  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${workspace.id}.pptx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
