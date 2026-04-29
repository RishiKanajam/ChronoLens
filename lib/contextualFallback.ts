import {
  CreateWorkspaceRequest,
  Discovery,
  LessonPack,
  SourceRecord,
  StudyModule,
  VisualRegion,
  Workspace,
} from "@/lib/types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 52);
}

export function inferTitle(query: string) {
  const cleaned = query.trim().replace(/[?.!]+$/g, "");
  return cleaned.length > 60 ? cleaned.slice(0, 60) : cleaned || "ChronoLens cultural study";
}

export function fallbackStudyModule(topic: string, difficulty = "Beginner", mode = "Student"): StudyModule {
  const title = inferTitle(topic);
  return {
    overview: `Study module for ${title}. Connect OPENAI_API_KEY for a fuller ${difficulty.toLowerCase()} ${mode.toLowerCase()} module with sourced evidence, dates, places, and cautious interpretation.`,
    keyTerms: [
      { term: title, definition: "The primary subject of this study module." },
      { term: "Evidence card", definition: "A claim paired with supporting evidence, uncertainty, and review status." },
      { term: "Context", definition: "Historical, social, geographic, or artistic information that helps interpret a source." },
    ],
    sourceDetectiveClues: [
      `Find one primary source that directly mentions ${title}.`,
      "Check who created the source, when it was made, and what institution holds it.",
      "Separate visible evidence from interpretation before drawing conclusions.",
    ],
    whatWeKnow: [`${title} is the topic selected by the learner.`],
    whatWeInfer: ["A fuller interpretation requires verified sources and, where relevant, expert or community review."],
    misconceptions: ["A single image, object, or text rarely proves a broad cultural claim by itself."],
    quiz: [
      {
        question: "Why should ChronoLens separate facts from interpretations?",
        answer: "Because cultural claims need evidence, uncertainty, and review rather than unsupported certainty.",
      },
    ],
    furtherReadingSourceIds: [],
  };
}

export function fallbackLessonPack(
  topic: string,
  classLevel = "Year 9",
  duration = "45 minutes",
  learningGoal = "source analysis",
): LessonPack {
  const title = inferTitle(topic);
  return {
    objective: `${classLevel} students will explore ${title} through ${learningGoal}, separating evidence from interpretation.`,
    starterQuestion: `What would count as reliable evidence about ${title}?`,
    activity: `In ${duration}, students list observable source details, write one cautious claim, and identify what evidence is still missing.`,
    mapTimelineActivity: "Place any verified sources on a simple timeline or map when dates and locations are available.",
    discussionQuestions: [
      "Which details are directly visible or documented?",
      "Which ideas are interpretations?",
      "Who might need to review this topic before we teach it confidently?",
    ],
    quizQuestions: [
      "What is one difference between a fact and a hypothesis?",
      "Why should source metadata be checked?",
      "What does expert or community review add?",
    ],
    rubric: [
      "Uses evidence rather than unsupported claims.",
      "Names uncertainty clearly.",
      "Respects cultural context and review needs.",
    ],
    homework: `Find one reputable source about ${title} and write a two-sentence evidence card.`,
    extensionActivity: "Compare two sources and identify whether they support the same claim or only an analogy.",
  };
}

export function fallbackVisualRegions(): VisualRegion[] {
  return [
    {
      id: "vr-1",
      label: "Primary visual region",
      x: 28,
      y: 22,
      width: 36,
      height: 34,
      confidence: 55,
      observation: "Generic region for visual inspection. Add an uploaded image or AI enrichment for specific labels.",
    },
    {
      id: "vr-2",
      label: "Border or framing area",
      x: 8,
      y: 8,
      width: 84,
      height: 14,
      confidence: 50,
      observation: "Potential framing or metadata area; interpretation requires source evidence.",
    },
    {
      id: "vr-3",
      label: "Material or surface clue",
      x: 12,
      y: 62,
      width: 30,
      height: 20,
      confidence: 48,
      observation: "Placeholder region for material, medium, or condition observations.",
    },
    {
      id: "vr-4",
      label: "Secondary detail",
      x: 64,
      y: 58,
      width: 22,
      height: 24,
      confidence: 46,
      observation: "Secondary visual detail to inspect before forming a claim.",
    },
  ];
}

export function generatedTopicSvg(topic: string) {
  const title = inferTitle(topic).replace(/[<>&"]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
    <rect width="960" height="620" fill="#111315"/>
    <rect x="44" y="44" width="872" height="532" rx="28" fill="#17191c" stroke="#2a2d31" stroke-width="2"/>
    <path d="M118 170h724M118 450h724M206 92v436M480 92v436M754 92v436" stroke="#2a2d31" stroke-width="1"/>
    <circle cx="480" cy="305" r="118" fill="#101214" stroke="#4fd1c5" stroke-width="4"/>
    <circle cx="480" cy="305" r="54" fill="#1f2225" stroke="#d4a857" stroke-width="3"/>
    <path d="M480 158c48 58 48 236 0 294M333 305c58-48 236-48 294 0M380 205c74 20 178 124 200 200M580 205c-74 20-178 124-200 200" fill="none" stroke="#4fd1c5" stroke-width="2" opacity=".65"/>
    <text x="480" y="74" fill="#f5f1e8" font-family="Inter, Arial, sans-serif" font-size="28" text-anchor="middle">${title}</text>
    <text x="480" y="548" fill="#a9a59b" font-family="Inter, Arial, sans-serif" font-size="18" text-anchor="middle">ChronoLens visual evidence canvas</text>
  </svg>`;
}

export function fallbackDiscoveries(query: string): Discovery[] {
  const title = inferTitle(query);
  return [
    {
      id: "disc-context-1",
      title: `Recent source watch for ${title}`,
      provider: "ChronoLens fallback",
      dateLabel: new Date().getFullYear().toString(),
      whyItMatters: "Live discovery adapters can add recent scholarship and archive records when available.",
      relevanceScore: 55,
    },
  ];
}

export function createFallbackWorkspace(
  input: CreateWorkspaceRequest,
  sourceRecords: SourceRecord[] = [],
): Workspace {
  const query = input.query.trim();
  const title = inferTitle(query);
  const id = `workspace-${slugify(query)}-${Date.now()}`;

  return {
    id,
    title,
    query,
    mode: input.mode || "researcher",
    lensType: input.lensType || "topic",
    createdAt: new Date().toISOString(),
    summary: `Research workspace for: ${query}. Connect an OpenAI API key for full analysis.`,
    keyQuestions: [
      `What are the key features of ${title}?`,
      `How did ${title} develop over time?`,
      "What cultural connections exist?",
    ],
    keyTerms: [{ term: title, definition: "The primary subject of this research workspace." }],
    sourceRecords,
    evidenceCards: [],
    connectionGraph: {
      nodes: [{ id: "n1", label: title, type: "topic" }],
      edges: [],
    },
    timelineEvents: [],
    visualRegions: fallbackVisualRegions(),
    generatedImageSvg: generatedTopicSvg(title),
    uploadedImageDataUrl: input.uploadedImageDataUrl,
    studyModule: fallbackStudyModule(title),
    lessonPack: fallbackLessonPack(title),
    discoveries: fallbackDiscoveries(title),
    geographyPoints: [],
    culturalFlows: [],
    status: {
      sourcesLoaded: sourceRecords.length,
      evidenceCards: 0,
      connectionsMapped: 0,
      lessonReady: false,
      aiMode: "unavailable",
    },
  };
}
