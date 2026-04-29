import { LensType } from "@/lib/types";

export const lensOptions: Array<{ id: LensType; label: string; description: string }> = [
  { id: "topic", label: "Topic", description: "Topic-first cultural learning and research." },
  { id: "artifact", label: "Artifact / Archaeology", description: "Material traces, object biography, and context." },
  { id: "visual_art", label: "Visual Art", description: "Iconography, composition, style, and patronage." },
  { id: "music", label: "Music Study", description: "Lyrics, ritual setting, instruments, and lineage." },
  { id: "performance", label: "Dance / Performance", description: "Gesture, staging, embodied transmission, and audience context." },
  { id: "architecture", label: "Architecture", description: "Plan, structure, ornament, place, and use." },
  { id: "textile", label: "Textile / Pattern", description: "Motifs, weave, dye, routes, and pattern migration." },
  { id: "manuscript", label: "Manuscript / Literature", description: "Page layout, script, illustration, and marginalia." },
  { id: "oral_tradition", label: "Oral Tradition", description: "Transmission, variants, community stewardship, and memory." },
];
