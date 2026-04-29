import {
  ArchitectureLayer,
  ConnectionEdge,
  ConnectionNode,
  CreateWorkspaceRequest,
  CulturalFlow,
  Discovery,
  EvidenceCard,
  GeographyPoint,
  LessonPack,
  SourceRecord,
  StudyModule,
  TimelineEvent,
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

export const defaultArchitectureLayers: ArchitectureLayer[] = [
  {
    id: "l1",
    name: "Finial & Lotus",
    description: "Gilded bronze finial atop the main dome combining Persian and Hindu lotus motifs.",
    material: "Bronze, Gold leaf",
    period: "1632-1643 CE",
    function: "Decorative crown symbolizing divine authority.",
    yPosition: 0,
    height: 8,
    color: "#d4a857",
  },
  {
    id: "l2",
    name: "Main Dome",
    description: "Double-shell onion dome rising 35 meters, a defining feature of Mughal architecture.",
    material: "White Makrana marble",
    period: "1632-1643 CE",
    function: "Primary architectural statement and structural crown.",
    yPosition: 8,
    height: 22,
    color: "#38bdf8",
  },
  {
    id: "l3",
    name: "Drum Base",
    description: "Cylindrical base supporting the dome with decorative arched openings.",
    material: "Marble over brick core",
    period: "1632-1643 CE",
    function: "Structural transition from square base to circular dome.",
    yPosition: 30,
    height: 10,
    color: "#22d3ee",
  },
  {
    id: "l4",
    name: "Upper Facade",
    description: "Iwans, or arched portals, with Quranic calligraphy inlaid in black marble.",
    material: "White marble, Black marble inlay, Semi-precious stones",
    period: "1632-1643 CE",
    function: "Ceremonial entrance and religious inscription display.",
    yPosition: 40,
    height: 18,
    color: "#a78bfa",
  },
  {
    id: "l5",
    name: "Lower Chamber",
    description: "Octagonal burial chamber housing cenotaphs of Shah Jahan and Mumtaz Mahal.",
    material: "Marble with pietra dura inlay",
    period: "1632-1643 CE",
    function: "Memorial and spiritual center.",
    yPosition: 58,
    height: 15,
    color: "#f59e0b",
  },
  {
    id: "l6",
    name: "Plinth & Platform",
    description: "Raised platform 6.7m high with four minarets at corners.",
    material: "Red sandstone base, marble surface",
    period: "1632-1643 CE",
    function: "Elevation above Yamuna river flood plain and ceremonial approach.",
    yPosition: 73,
    height: 12,
    color: "#10b981",
  },
  {
    id: "l7",
    name: "Foundation & Substructure",
    description: "Deep well foundations with timber piles driven into riverbank soil.",
    material: "Timber, brick, mortar",
    period: "1632 CE",
    function: "Structural support in soft alluvial soil near Yamuna river.",
    yPosition: 85,
    height: 15,
    color: "#64748b",
  },
];

export function generatedTopicSvg(topic: string) {
  const title = inferTitle(topic).replace(/[<>&"]/g, "");
  const lower = title.toLowerCase();
  const kind =
    /taj|architecture|temple|mosque|cathedral|palace|building|mahal|fort|stupa|monument/.test(lower)
      ? "architecture"
      : /manuscript|page|folio|script|literature|book|codex/.test(lower)
        ? "manuscript"
        : /textile|pattern|cloth|weaving|kente|rug|carpet|fabric/.test(lower)
          ? "textile"
          : /woodblock|ukiyo|print/.test(lower)
            ? "woodblock"
            : /song|music|dance|performance|oral|ritual/.test(lower)
              ? "performance"
              : /seal|indus|artifact|archaeology/.test(lower)
                ? "artifact"
                : /lotus|flower|motif/.test(lower)
                  ? "lotus"
                  : "atlas";

  const sharedText = `<text x="480" y="74" fill="#121416" font-family="Inter, Arial, sans-serif" font-size="28" text-anchor="middle">${title}</text>
    <text x="480" y="548" fill="#6f6759" font-family="Inter, Arial, sans-serif" font-size="18" text-anchor="middle">Topic-specific ChronoLens visual evidence canvas</text>`;

  if (kind === "architecture") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="44" y="44" width="872" height="532" rx="18" fill="#fffdf8" stroke="#ddd5c8" stroke-width="2"/>
      <path d="M120 500h720M178 500V305M782 500V305M240 500V250M720 500V250" stroke="#cfc5b6" stroke-width="3"/>
      <path d="M250 250h460M290 250C340 150 620 150 670 250" fill="#f7f1e7" stroke="#0f766e" stroke-width="5"/>
      <path d="M480 158C545 205 562 283 530 344H430C398 283 415 205 480 158Z" fill="#fffaf1" stroke="#0f766e" stroke-width="5"/>
      <path d="M405 500V352h150v148M430 500V386h100v114" fill="none" stroke="#b7791f" stroke-width="4"/>
      <path d="M172 304C192 248 228 248 248 304M712 304C732 248 768 248 788 304" fill="none" stroke="#0f766e" stroke-width="4"/>
      <path d="M170 324h80M710 324h80M330 500V330M630 500V330" stroke="#ddd5c8" stroke-width="3"/>
      <circle cx="480" cy="140" r="9" fill="#b7791f"/>
      ${sharedText}
    </svg>`;
  }

  if (kind === "manuscript") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="130" y="95" width="700" height="430" rx="14" fill="#fffdf8" stroke="#d8cab8" stroke-width="3"/>
      <rect x="168" y="132" width="258" height="356" fill="#f7f1e7" stroke="#ddd5c8"/>
      <rect x="470" y="132" width="322" height="356" fill="#fffaf1" stroke="#ddd5c8"/>
      <circle cx="298" cy="248" r="74" fill="#0f766e" fill-opacity=".12" stroke="#0f766e" stroke-width="4"/>
      <path d="M298 175c28 35 28 111 0 146M225 248c35-28 111-28 146 0" stroke="#b7791f" stroke-width="3" fill="none"/>
      ${Array.from({ length: 11 }).map((_, i) => `<path d="M510 ${158 + i * 27}h238" stroke="#cfc5b6" stroke-width="5" stroke-linecap="round"/>`).join("")}
      <rect x="492" y="148" width="12" height="314" fill="#b7791f" opacity=".45"/>
      ${sharedText}
    </svg>`;
  }

  if (kind === "textile") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="88" y="94" width="784" height="432" rx="16" fill="#fffdf8" stroke="#ddd5c8" stroke-width="2"/>
      ${Array.from({ length: 9 }).map((_, i) => `<rect x="${120 + i * 82}" y="132" width="48" height="356" fill="${i % 3 === 0 ? "#0f766e" : i % 3 === 1 ? "#b7791f" : "#7c3aed"}" fill-opacity=".16" stroke="#ddd5c8"/>`).join("")}
      ${Array.from({ length: 6 }).map((_, i) => `<path d="M120 ${168 + i * 58}h720" stroke="${i % 2 ? "#0f766e" : "#b7791f"}" stroke-width="3" stroke-dasharray="12 10" opacity=".55"/>`).join("")}
      <path d="M480 184l54 86-54 86-54-86zM480 310l54 86-54 86-54-86z" fill="#fffaf1" stroke="#0f766e" stroke-width="4"/>
      ${sharedText}
    </svg>`;
  }

  if (kind === "woodblock") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="110" y="92" width="740" height="436" rx="12" fill="#fffdf8" stroke="#ddd5c8" stroke-width="3"/>
      <path d="M145 410c95-70 160-80 248-24 92 60 175 52 286-46 58-51 103-73 136-72v210H145z" fill="#0f766e" fill-opacity=".15"/>
      <path d="M140 360c110-65 180-74 276-20 88 49 160 37 270-50 55-44 96-61 130-56" fill="none" stroke="#0f766e" stroke-width="5"/>
      <circle cx="682" cy="190" r="58" fill="#d4a857" fill-opacity=".28" stroke="#b7791f" stroke-width="3"/>
      <path d="M210 170h280M210 205h230M210 240h260M210 275h210" stroke="#cfc5b6" stroke-width="8" stroke-linecap="round"/>
      ${sharedText}
    </svg>`;
  }

  if (kind === "performance") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="76" y="84" width="808" height="452" rx="18" fill="#fffdf8" stroke="#ddd5c8" stroke-width="2"/>
      <circle cx="286" cy="252" r="72" fill="#0f766e" fill-opacity=".12" stroke="#0f766e" stroke-width="4"/>
      <path d="M286 180v150M218 252h136M245 205c58 42 80 100 40 154M326 205c-58 42-80 100-40 154" stroke="#b7791f" stroke-width="4" fill="none"/>
      <circle cx="642" cy="240" r="62" fill="#b7791f" fill-opacity=".13" stroke="#b7791f" stroke-width="4"/>
      <path d="M580 356c42-78 88-78 130 0M550 410h190M570 445h150" stroke="#0f766e" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M430 268c42-38 74-38 112 0M428 306c46-28 80-28 118 0" stroke="#7c3aed" stroke-width="3" fill="none"/>
      ${sharedText}
    </svg>`;
  }

  if (kind === "artifact") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="260" y="132" width="440" height="356" rx="24" fill="#eee7da" stroke="#b79a70" stroke-width="5"/>
      <rect x="302" y="172" width="356" height="276" rx="14" fill="#fffaf1" stroke="#d8cab8" stroke-width="2"/>
      <path d="M480 210c42 28 70 75 70 124 0 35-28 64-70 64s-70-29-70-64c0-49 28-96 70-124z" fill="#0f766e" fill-opacity=".13" stroke="#0f766e" stroke-width="4"/>
      <path d="M382 388h196M382 342h196M382 296h56M522 296h56" stroke="#b7791f" stroke-width="5" stroke-linecap="round"/>
      <circle cx="480" cy="300" r="22" fill="#fffdf8" stroke="#0f766e" stroke-width="4"/>
      ${sharedText}
    </svg>`;
  }

  if (kind === "lotus") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <rect width="960" height="620" fill="#f6f1e8"/>
      <rect x="44" y="44" width="872" height="532" rx="18" fill="#fffdf8" stroke="#ddd5c8" stroke-width="2"/>
      <circle cx="480" cy="305" r="138" fill="#f7f1e7" stroke="#0f766e" stroke-width="4"/>
      ${Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 480 + Math.cos(angle) * 78;
        const y = 305 + Math.sin(angle) * 78;
        const rot = i * 30;
        return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="28" ry="74" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#0f766e" fill-opacity=".14" stroke="#0f766e" stroke-width="2"/>`;
      }).join("")}
      <circle cx="480" cy="305" r="52" fill="#fffaf1" stroke="#b7791f" stroke-width="4"/>
      ${sharedText}
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
    <rect width="960" height="620" fill="#f6f1e8"/>
    <rect x="44" y="44" width="872" height="532" rx="18" fill="#fffdf8" stroke="#ddd5c8" stroke-width="2"/>
    <path d="M118 170h724M118 450h724M206 92v436M480 92v436M754 92v436" stroke="#e2dacd" stroke-width="1"/>
    <circle cx="480" cy="305" r="118" fill="#f7f1e7" stroke="#0f766e" stroke-width="4"/>
    <circle cx="480" cy="305" r="54" fill="#fffaf1" stroke="#b7791f" stroke-width="3"/>
    <path d="M480 158c48 58 48 236 0 294M333 305c58-48 236-48 294 0M380 205c74 20 178 124 200 200M580 205c-74 20-178 124-200 200" fill="none" stroke="#0f766e" stroke-width="2" opacity=".65"/>
    ${sharedText}
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

function sourceConfidence(source?: SourceRecord, fallback = 62) {
  if (!source) return fallback;
  const value = Number(source.relevanceScore);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(35, Math.min(92, Math.round(value <= 1 ? value * 100 : value)));
}

function sourceDate(source: SourceRecord, index: number) {
  return source.dateLabel || source.period || (index === 0 ? "Source date unknown" : `Source ${index + 1}`);
}

export function fallbackEvidenceCards(title: string, sources: SourceRecord[]): EvidenceCard[] {
  const usefulSources = sources.slice(0, 7);
  if (!usefulSources.length) {
    return [
      {
        id: "ev-fallback-review",
        claim: `Research about ${title} requires source discovery before cultural conclusions are made.`,
        classification: "needs_review",
        evidence: ["No source records are currently loaded for this workspace."],
        sourceIds: [],
        confidence: 40,
        uncertainty: "ChronoLens needs source records, expert context, or community review before making claims.",
        counterEvidence: ["A topic prompt by itself is not evidence."],
        needsExpertReview: true,
      },
    ];
  }

  return usefulSources.map((source, index) => ({
    id: `ev-source-context-${index + 1}`,
    claim: `The source "${source.title}" may provide context for studying ${title}.`,
    classification: index < 2 ? "context" : "possible_connection",
    evidence: [
      source.description || `${source.provider.replace(/_/g, " ")} returned this record for the workspace query.`,
      [
        source.institution ? `Institution: ${source.institution}.` : "",
        source.collection ? `Collection: ${source.collection}.` : "",
        source.dateLabel ? `Date/period: ${source.dateLabel}.` : "",
      ].filter(Boolean).join(" ") || "Metadata is limited and should be checked before use.",
    ],
    sourceIds: [source.id],
    confidence: sourceConfidence(source),
    uncertainty: "Search-result relevance does not prove cultural interpretation; compare against primary records and specialist sources.",
    counterEvidence: ["Catalog matches can be broad, incomplete, or only indirectly related to the research question."],
    needsExpertReview: index > 3,
  }));
}

export function fallbackConnectionGraph(title: string, sources: SourceRecord[]): { nodes: ConnectionNode[]; edges: ConnectionEdge[] } {
  const lower = title.toLowerCase();
  const nodes: ConnectionNode[] = [
    {
      id: "n-topic",
      label: title,
      type: "topic",
      explanation: "Primary research topic for this workspace.",
      confidence: 70,
      uncertainty: "Topic relationships need source-by-source verification.",
    },
  ];

  const aspectNodes: ConnectionNode[] = /japan|woodblock|ukiyo|edo|print/.test(lower)
    ? [
      {
        id: "n-aspect-1",
        label: "Ukiyo-e print culture",
        type: "artwork",
        explanation: "A research category for woodblock prints, publishers, artists, and urban audiences.",
        confidence: 66,
        uncertainty: "Specific artist, school, or object claims still require catalog evidence.",
      },
      {
        id: "n-aspect-2",
        label: "Edo publishing networks",
        type: "period",
        explanation: "A period/context node for early modern commercial publishing and print circulation.",
        confidence: 62,
        uncertainty: "Transmission routes vary by publisher, city, and date.",
      },
      {
        id: "n-aspect-3",
        label: "Kabuki and performance imagery",
        type: "dance",
        explanation: "Actor prints and theater culture can be relevant, but should be tied to dated source records.",
        confidence: 58,
        uncertainty: "Not every woodblock print relates to performance.",
      },
      {
        id: "n-aspect-4",
        label: "Color and block technique",
        type: "research",
        explanation: "Technique, pigments, and multi-block printing are research lenses for comparing examples.",
        confidence: 60,
        uncertainty: "Technical identification needs object records or conservation evidence.",
      },
    ]
    : /indus|harappa|seal/.test(lower)
      ? [
        {
          id: "n-aspect-1",
          label: "Seal iconography",
          type: "artifact",
          explanation: "Animal, sign, and motif imagery on seals can be compared as evidence, not as final decipherment.",
          confidence: 64,
          uncertainty: "The Indus script remains undeciphered.",
        },
        {
          id: "n-aspect-2",
          label: "Urban trade context",
          type: "place",
          explanation: "Seal use may connect to administration, exchange, and urban archaeology.",
          confidence: 58,
          uncertainty: "Use-context varies by site and findspot.",
        },
        {
          id: "n-aspect-3",
          label: "Undeciphered script",
          type: "research",
          explanation: "Script signs are evidence, but meaning requires caution and specialist review.",
          confidence: 55,
          uncertainty: "Interpretations of signs remain contested.",
        },
      ]
      : [
        {
          id: "n-aspect-1",
          label: "Source record cluster",
          type: "source",
          explanation: "A cluster of live archive and research records returned for the query.",
          confidence: 58,
          uncertainty: "Search relevance should be checked against each source.",
        },
        {
          id: "n-aspect-2",
          label: "Cultural context",
          type: "research",
          explanation: "Context node for places, periods, communities, forms, and source metadata.",
          confidence: 54,
          uncertainty: "Context is not proof of influence.",
        },
        {
          id: "n-aspect-3",
          label: "Teaching pathway",
          type: "research",
          explanation: "A learning pathway that separates facts, possible connections, and review needs.",
          confidence: 60,
          uncertainty: "Classroom use should keep claims cautious.",
        },
      ];
  nodes.push(...aspectNodes);

  const sourceNodes = sources.slice(0, 5).map((source, index) => ({
    id: `n-source-${index + 1}`,
    label: source.title.slice(0, 38),
    type: "source" as const,
    explanation: source.description || "Live source-adapter result connected to the workspace query.",
    sourceIds: [source.id],
    confidence: sourceConfidence(source),
    uncertainty: "This is a search-result connection, not a final interpretation.",
  }));
  nodes.push(...sourceNodes);

  const regions = Array.from(new Set(sources.map((source) => source.region).filter(Boolean))).slice(0, 2);
  regions.forEach((region, index) => {
    nodes.push({
      id: `n-place-${index + 1}`,
      label: region || "Region",
      type: "place",
      explanation: "Region metadata found in source records.",
      confidence: 58,
      uncertainty: "Regional labels can be broad or catalog-specific.",
    });
  });

  const edges: ConnectionEdge[] = aspectNodes.map((node, index) => ({
    source: "n-topic",
    target: node.id,
    label: index === 0 ? "core research lens" : "contextual bridge",
    relationType: index === 0 ? "shared_motif" : index === 1 ? "same_period" : "possible_influence",
    confidence: index === 0 ? 68 : 56,
  }));

  const sourceEdges: ConnectionEdge[] = sourceNodes.map((node, index) => ({
    source: "n-topic",
    target: node.id,
    label: "source candidate",
    relationType: "direct_evidence",
    confidence: sourceConfidence(sources[index], 60),
  }));
  edges.push(...sourceEdges);

  sourceNodes.slice(0, aspectNodes.length).forEach((sourceNode, index) => {
    edges.push({
      source: aspectNodes[index].id,
      target: sourceNode.id,
      label: "source may support this bridge",
      relationType: index % 2 === 0 ? "direct_evidence" : "possible_influence",
      confidence: sourceConfidence(sources[index], 55),
    });
  });

  regions.forEach((_, index) => {
    edges.push({
      source: "n-topic",
      target: `n-place-${index + 1}`,
      label: "same region metadata",
      relationType: "same_region",
      confidence: 58,
    });
  });

  if (aspectNodes.length > 1) {
    edges.push({
      source: aspectNodes[0].id,
      target: aspectNodes[1].id,
      label: "possible period/context relationship",
      relationType: "same_period",
      confidence: 54,
    });
  }

  return { nodes, edges };
}

export function fallbackTimelineEvents(title: string, sources: SourceRecord[]): TimelineEvent[] {
  const dated = sources.filter((source) => source.dateLabel || source.period).slice(0, 5);
  if (!dated.length) {
    return [
      {
        id: "t-fallback-created",
        title: "Workspace created",
        dateLabel: new Date().getFullYear().toString(),
        description: `ChronoLens created a research workspace for ${title}. Add dated sources or AI enrichment for a fuller timeline.`,
        sourceIds: [],
        confidence: 45,
      },
    ];
  }

  return dated.map((source, index) => ({
    id: `t-source-${index + 1}`,
    title: source.title.slice(0, 64),
    dateLabel: sourceDate(source, index),
    description: source.description || `Dated source record from ${source.provider.replace(/_/g, " ")}.`,
    sourceIds: [source.id],
    confidence: sourceConfidence(source, 58),
  }));
}

function geographyTemplate(query: string): GeographyPoint[] {
  const lower = query.toLowerCase();
  if (/japan|woodblock|ukiyo|edo/.test(lower)) {
    return [
      { id: "g1", name: "Edo / Tokyo", lat: 35.6762, lng: 139.6503, region: "Japan", period: "Edo to modern period", culturalElements: ["woodblock publishing", "urban visual culture"], sourceIds: [], significance: "Edo was a major center for ukiyo-e publishing and popular print culture." },
      { id: "g2", name: "Kyoto", lat: 35.0116, lng: 135.7681, region: "Japan", period: "Early modern Japan", culturalElements: ["workshops", "court and temple culture"], sourceIds: [], significance: "Kyoto anchors older artistic, literary, and craft networks relevant to Japanese print study." },
      { id: "g3", name: "Osaka", lat: 34.6937, lng: 135.5023, region: "Japan", period: "Edo period", culturalElements: ["theater prints", "commercial culture"], sourceIds: [], significance: "Osaka print culture is strongly connected to kabuki, performance, and merchant audiences." },
      { id: "g4", name: "Yokohama", lat: 35.4437, lng: 139.638, region: "Japan", period: "19th century", culturalElements: ["port exchange", "Yokohama-e"], sourceIds: [], significance: "Yokohama became important for international exchange and export-era visual culture." },
    ];
  }
  if (/indus|harappa|seal/.test(lower)) {
    return [
      { id: "g1", name: "Harappa", lat: 30.628, lng: 72.866, region: "Punjab", period: "c. 2600-1900 BCE", culturalElements: ["seals", "urban archaeology"], sourceIds: [], significance: "Harappa is one of the key excavated urban centers associated with Indus seals." },
      { id: "g2", name: "Mohenjo-daro", lat: 27.3294, lng: 68.1386, region: "Sindh", period: "c. 2600-1900 BCE", culturalElements: ["seal finds", "urban planning"], sourceIds: [], significance: "Mohenjo-daro provides major archaeological context for seal iconography and administration." },
      { id: "g3", name: "Dholavira", lat: 23.887, lng: 70.214, region: "Gujarat", period: "c. 3000-1500 BCE", culturalElements: ["signage", "trade"], sourceIds: [], significance: "Dholavira helps compare Indus urbanism, inscriptions, and regional variation." },
      { id: "g4", name: "Lothal", lat: 22.521, lng: 72.249, region: "Gujarat", period: "c. 2400-1900 BCE", culturalElements: ["trade", "craft"], sourceIds: [], significance: "Lothal is often discussed in relation to trade, craft production, and maritime links." },
    ];
  }
  return [
    { id: "g1", name: "Source hub", lat: 40.7128, lng: -74.006, region: "Museum / archive records", period: "Modern cataloging", culturalElements: ["museum objects", "metadata"], sourceIds: [], significance: "A source-hub point marks where catalog records and collection metadata enter the research workflow." },
    { id: "g2", name: "Library hub", lat: 38.9072, lng: -77.0369, region: "Library records", period: "Modern scholarship", culturalElements: ["books", "images", "archives"], sourceIds: [], significance: "A library-hub point represents documentary and archival source discovery." },
    { id: "g3", name: "Research network", lat: 51.5072, lng: -0.1276, region: "Scholarly records", period: "Modern scholarship", culturalElements: ["articles", "bibliography"], sourceIds: [], significance: "A research-network point groups scholarly records that need review against the cultural topic." },
  ];
}

export function fallbackGeographyPoints(query: string, sources: SourceRecord[]): GeographyPoint[] {
  const sourceIds = sources.slice(0, 4).map((source) => source.id);
  return geographyTemplate(query).map((point, index) => ({
    ...point,
    sourceIds: sourceIds.length ? sourceIds.slice(0, Math.max(1, Math.min(sourceIds.length, index + 1))) : [],
  }));
}

export function fallbackCulturalFlows(points: GeographyPoint[]): CulturalFlow[] {
  return points.slice(0, -1).map((point, index) => ({
    id: `f-fallback-${index + 1}`,
    from: point.id,
    to: points[index + 1].id,
    flowType: index % 2 === 0 ? "artistic_influence" : "trade_route",
    label: `Possible research connection: ${point.name} to ${points[index + 1].name}`,
    confidence: 0.55,
    evidence: "Fallback flow based on topic geography and source metadata. Treat as a research prompt, not a confirmed transmission route.",
  }));
}

export function enrichFallbackWorkspaceSections(workspace: Workspace): Workspace {
  const evidenceCards = workspace.evidenceCards.length
    ? workspace.evidenceCards
    : fallbackEvidenceCards(workspace.title, workspace.sourceRecords);
  const weakConnectionGraph = workspace.connectionGraph.nodes.length < 10 || workspace.connectionGraph.edges.length < 8;
  const connectionGraph = workspace.connectionGraph.edges.length && !weakConnectionGraph
    ? workspace.connectionGraph
    : fallbackConnectionGraph(workspace.title, workspace.sourceRecords);
  const timelineEvents = workspace.timelineEvents.length
    ? workspace.timelineEvents
    : fallbackTimelineEvents(workspace.title, workspace.sourceRecords);
  const geographyPoints = workspace.geographyPoints?.length
    ? workspace.geographyPoints
    : fallbackGeographyPoints(workspace.query, workspace.sourceRecords);
  const culturalFlows = workspace.culturalFlows?.length
    ? workspace.culturalFlows
    : fallbackCulturalFlows(geographyPoints);

  return {
    ...workspace,
    evidenceCards,
    connectionGraph,
    timelineEvents,
    geographyPoints,
    culturalFlows,
    status: {
      ...workspace.status,
      evidenceCards: evidenceCards.length,
      connectionsMapped: connectionGraph.edges.length,
      lessonReady: true,
    },
  };
}

export function createFallbackWorkspace(
  input: CreateWorkspaceRequest,
  sourceRecords: SourceRecord[] = [],
): Workspace {
  const query = input.query.trim();
  const title = inferTitle(query);
  const id = `workspace-${slugify(query)}-${Date.now()}`;

  return enrichFallbackWorkspaceSections({
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
    connectionGraph: { nodes: [{ id: "n1", label: title, type: "topic" }], edges: [] },
    timelineEvents: [],
    visualRegions: fallbackVisualRegions(),
    generatedImageSvg: generatedTopicSvg(title),
    uploadedImageDataUrl: input.uploadedImageDataUrl,
    studyModule: fallbackStudyModule(title),
    lessonPack: fallbackLessonPack(title),
    discoveries: fallbackDiscoveries(title),
    geographyPoints: [],
    culturalFlows: [],
    architectureLayers: defaultArchitectureLayers,
    status: {
      sourcesLoaded: sourceRecords.length,
      evidenceCards: 0,
      connectionsMapped: 0,
      lessonReady: false,
      aiMode: "unavailable",
    },
  });
}
