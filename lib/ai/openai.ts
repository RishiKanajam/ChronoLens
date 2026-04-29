import {
  ClaimClassification,
  ConnectionEdge,
  ConnectionNode,
  CulturalFlow,
  EvidenceCard,
  GeographyPoint,
  LessonPack,
  SourceRecord,
  StudyModule,
  TimelineEvent,
  Workspace,
} from "@/lib/types";
import { fallbackLessonPack, fallbackStudyModule, generatedTopicSvg, inferTitle } from "@/lib/contextualFallback";

type JsonRecord = Record<string, unknown>;

const workspaceSystemPrompt = `You are ChronoLens, a cultural research engine. Given a query, generate a complete research workspace as JSON with these exact fields:

{
  "title": "short title for the topic",
  "summary": "3-4 sentence research overview with specific facts, dates, places",
  "keyQuestions": ["3 research questions"],
  "keyTerms": [{"term": "...", "definition": "..."}, ...5 items],
  "sourceRecords": [
    {"id": "s1", "provider": "openalex", "title": "...", "type": "article|book|image|museum_object|music|manuscript", "creator": "...", "institution": "...", "dateLabel": "...", "period": "...", "region": "...", "description": "...", "relevanceScore": 0.95, "externalUrl": "https://..."},
    ...8 source records, use realistic titles and institutions, mix providers (openalex, library_of_congress, met_museum, musicbrainz)
  ],
  "evidenceCards": [
    {"id": "e1", "claim": "...", "classification": "fact|context|possible_connection|hypothesis|needs_review", "evidence": ["supporting evidence 1", "supporting evidence 2"], "sourceIds": ["s1","s2"], "confidence": 0.9, "uncertainty": "what remains uncertain", "needsExpertReview": false},
    ...7 evidence cards with HONEST classifications. Only use "fact" for well-documented claims. Use "hypothesis" or "possible_connection" for interpretive claims. Use "needs_review" for culturally sensitive claims.
  ],
  "connectionGraph": {
    "nodes": [
      {"id": "n1", "label": "...", "type": "topic|artifact|artwork|music|dance|textile|manuscript|place|period|source|research"},
      ...8 nodes relevant to THIS specific query
    ],
    "edges": [
      {"source": "n1", "target": "n2", "label": "relationship description", "relationType": "direct_evidence|shared_motif|same_region|same_period|possible_influence|analogy_only", "confidence": 0.85},
      ...8 edges connecting the nodes
    ]
  },
  "timelineEvents": [
    {"id": "t1", "title": "...", "dateLabel": "...", "description": "...", "confidence": 0.9},
    ...5 timeline events
  ],
  "studyModule": {
    "overview": "4 paragraph engaging overview for students",
    "keyTerms": [{"term": "...", "definition": "..."}, ...5],
    "sourceDetectiveClues": ["clue 1", "clue 2", "clue 3"],
    "whatWeKnow": ["fact 1", "fact 2", "fact 3"],
    "whatWeInfer": ["inference 1", "inference 2"],
    "misconceptions": ["common misconception 1", "misconception 2"],
    "quiz": [{"question": "...", "answer": "..."}, ...5],
    "furtherReadingSourceIds": ["s1", "s3"]
  },
  "lessonPack": {
    "objective": "learning objective",
    "starterQuestion": "engaging opener question",
    "activity": "main classroom activity description",
    "mapTimelineActivity": "geography/timeline activity",
    "discussionQuestions": ["q1", "q2", "q3"],
    "quizQuestions": ["q1", "q2", "q3"],
    "rubric": ["criteria 1", "criteria 2", "criteria 3"],
    "homework": "homework task",
    "extensionActivity": "extension for advanced students"
  },
  "geographyPoints": [
    {"id": "g1", "name": "place name", "lat": 0.0, "lng": 0.0, "region": "...", "period": "...", "culturalElements": ["element1"], "sourceIds": ["s1"], "significance": "why this place matters"},
    ...5 geography points
  ],
  "culturalFlows": [
    {"id": "f1", "from": "g1", "to": "g2", "flowType": "trade_route|colonial_influence|migration|religious_transmission|artistic_influence", "label": "...", "confidence": 0.7, "evidence": "..."},
    ...4 cultural flows
  ]
}

IMPORTANT RULES:
- Generate data SPECIFIC to the user's query. If they ask about "Islamic Geometric Patterns", every source, evidence card, connection, and timeline event must be about Islamic geometric patterns — NOT about lotus motifs.
- Be honest about classifications. Cultural interpretations are "hypothesis" or "possible_connection", not "fact".
- Use real institution names (British Museum, Met Museum, Library of Congress, Smithsonian, Victoria & Albert Museum, etc.)
- Use realistic source titles that sound like real academic papers and museum records.
- Return ONLY valid JSON, no markdown backticks.`;

function arr(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function score(value: unknown, fallback = 70) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  const asPercent = numeric <= 1 ? numeric * 100 : numeric;
  return Math.min(100, Math.max(0, Math.round(asPercent)));
}

function boundedFraction(value: unknown, fallback = 0.5) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(1, Math.max(0, numeric > 1 ? numeric / 100 : numeric));
}

function validClassification(value: unknown): ClaimClassification {
  const allowed: ClaimClassification[] = ["fact", "context", "possible_connection", "hypothesis", "analogy", "needs_review"];
  return allowed.includes(value as ClaimClassification) ? (value as ClaimClassification) : "needs_review";
}

function sourceType(value: unknown): SourceRecord["type"] {
  const allowed: SourceRecord["type"][] = ["image", "book", "article", "music", "museum_object", "manuscript", "map", "video", "audio", "other"];
  return allowed.includes(value as SourceRecord["type"]) ? (value as SourceRecord["type"]) : "other";
}

function provider(value: unknown): SourceRecord["provider"] {
  const allowed: SourceRecord["provider"][] = [
    "demo",
    "openalex",
    "library_of_congress",
    "met_museum",
    "musicbrainz",
    "wikidata",
    "europeana",
    "smithsonian",
    "crossref",
  ];
  return allowed.includes(value as SourceRecord["provider"]) ? (value as SourceRecord["provider"]) : "openalex";
}

function normalizeSources(value: unknown, liveSources: SourceRecord[]): SourceRecord[] {
  const aiSources = Array.isArray(value)
    ? value.map((item, index) => {
        const r = (item || {}) as JsonRecord;
        return {
          id: String(r.id || `s${index + 1}`),
          provider: provider(r.provider),
          title: String(r.title || "Untitled source"),
          type: sourceType(r.type),
          creator: r.creator ? String(r.creator) : undefined,
          institution: r.institution ? String(r.institution) : undefined,
          collection: r.collection ? String(r.collection) : undefined,
          dateLabel: r.dateLabel ? String(r.dateLabel) : undefined,
          period: r.period ? String(r.period) : undefined,
          region: r.region ? String(r.region) : undefined,
          thumbnailUrl: r.thumbnailUrl ? String(r.thumbnailUrl) : undefined,
          externalUrl: r.externalUrl ? String(r.externalUrl) : undefined,
          rights: r.rights ? String(r.rights) : undefined,
          description: r.description ? String(r.description) : undefined,
          relevanceScore: score(r.relevanceScore, 80),
        } satisfies SourceRecord;
      })
    : [];

  const seen = new Set<string>();
  return [...aiSources, ...liveSources]
    .filter((source) => {
      const key = `${source.provider}:${source.title}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 16);
}

function normalizeStudy(value: unknown, query: string): StudyModule {
  const fallback = fallbackStudyModule(query);
  const raw = (value || {}) as JsonRecord;
  const keyTerms = Array.isArray(raw.keyTerms)
    ? raw.keyTerms.map((item) => {
        const term = (item || {}) as JsonRecord;
        return { term: String(term.term || ""), definition: String(term.definition || "") };
      }).filter((item) => item.term && item.definition)
    : fallback.keyTerms;

  const quiz = Array.isArray(raw.quiz)
    ? raw.quiz.map((item) => {
        const q = (item || {}) as JsonRecord;
        return { question: String(q.question || ""), answer: String(q.answer || "") };
      }).filter((item) => item.question && item.answer)
    : fallback.quiz;

  return {
    overview: String(raw.overview || fallback.overview),
    keyTerms,
    sourceDetectiveClues: arr(raw.sourceDetectiveClues),
    whatWeKnow: arr(raw.whatWeKnow),
    whatWeInfer: arr(raw.whatWeInfer),
    misconceptions: arr(raw.misconceptions),
    expertsDebate: arr(raw.expertsDebate),
    quiz,
    furtherReadingSourceIds: arr(raw.furtherReadingSourceIds),
  };
}

function normalizeLesson(value: unknown, query: string): LessonPack {
  const fallback = fallbackLessonPack(query);
  const raw = (value || {}) as JsonRecord;
  return {
    objective: String(raw.objective || fallback.objective),
    starterQuestion: String(raw.starterQuestion || fallback.starterQuestion),
    activity: String(raw.activity || fallback.activity),
    mapTimelineActivity: String(raw.mapTimelineActivity || fallback.mapTimelineActivity),
    discussionQuestions: arr(raw.discussionQuestions).length ? arr(raw.discussionQuestions) : fallback.discussionQuestions,
    quizQuestions: arr(raw.quizQuestions).length ? arr(raw.quizQuestions) : fallback.quizQuestions,
    rubric: arr(raw.rubric).length ? arr(raw.rubric) : fallback.rubric,
    homework: String(raw.homework || fallback.homework),
    extensionActivity: String(raw.extensionActivity || fallback.extensionActivity),
  };
}

const VALID_MODELS = [
  "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano",
  "gpt-4o", "gpt-4o-mini",
  "gpt-4-turbo", "gpt-4",
  "gpt-3.5-turbo",
  "gpt-4.5", "gpt-5", "gpt-5.5",
  "o1", "o1-mini", "o3", "o3-mini", "o4-mini",
];

function resolveModel(): string {
  const envModel = process.env.OPENAI_MODEL;
  if (envModel && VALID_MODELS.includes(envModel)) return envModel;
  if (envModel) {
    console.warn(`[ChronoLens] OPENAI_MODEL="${envModel}" may not be valid — falling back to gpt-4.1`);
  }
  return "gpt-4.1";
}

export async function callOpenAIJson<T>(system: string, user: string, maxTokens = 4000): Promise<T | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[ChronoLens] OPENAI_API_KEY is not set — skipping AI enrichment.");
    return null;
  }

  const model = resolveModel();
  console.log(`[ChronoLens] Calling OpenAI model=${model} max_tokens=${maxTokens}`);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({})) as { error?: { message?: string; code?: string } };
      console.error(`[ChronoLens] OpenAI API error ${response.status}: ${errBody.error?.message || "unknown"}`);
      if (response.status === 429 || errBody.error?.code === "insufficient_quota") {
        throw new Error("quota_exceeded");
      }
      return null;
    }

    const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      console.error("[ChronoLens] OpenAI returned no content in choices.");
      return null;
    }
    return JSON.parse(content) as T;
  } catch (err) {
    if (err instanceof Error && err.message === "quota_exceeded") throw err;
    console.error("[ChronoLens] callOpenAIJson threw:", err);
    return null;
  }
}

export async function generateWorkspaceContent(query: string, workspace: Workspace): Promise<Partial<Workspace> | null> {
  const parsed = await callOpenAIJson<JsonRecord>(workspaceSystemPrompt, query, 4000);
  if (!parsed) return null;

  const sourceRecords = normalizeSources(parsed.sourceRecords, workspace.sourceRecords);
  const fallbackSourceIds = sourceRecords.slice(0, 3).map((source) => source.id);

  const evidenceCards: EvidenceCard[] = Array.isArray(parsed.evidenceCards)
    ? parsed.evidenceCards.map((item, index) => {
        const card = (item || {}) as JsonRecord;
        return {
          id: String(card.id || `e${index + 1}`),
          claim: String(card.claim || "This claim requires expert review."),
          classification: validClassification(card.classification),
          evidence: arr(card.evidence),
          sourceIds: arr(card.sourceIds).length ? arr(card.sourceIds) : fallbackSourceIds,
          confidence: score(card.confidence, 70),
          uncertainty: String(card.uncertainty || "Requires verification against primary sources."),
          counterEvidence: arr(card.counterEvidence),
          needsExpertReview: Boolean(card.needsExpertReview),
          visualRegionId: card.visualRegionId ? String(card.visualRegionId) : undefined,
        };
      })
    : [];

  const graph = (parsed.connectionGraph || {}) as JsonRecord;
  const nodes: ConnectionNode[] = Array.isArray(graph.nodes)
    ? graph.nodes.map((item, index) => {
        const node = (item || {}) as JsonRecord;
        return {
          id: String(node.id || `n${index + 1}`),
          label: String(node.label || inferTitle(query)),
          type: String(node.type || "research") as ConnectionNode["type"],
          explanation: node.explanation ? String(node.explanation) : undefined,
          confidence: score(node.confidence, 70),
          sourceIds: arr(node.sourceIds),
          evidenceCardIds: arr(node.evidenceCardIds),
          uncertainty: node.uncertainty ? String(node.uncertainty) : undefined,
        };
      })
    : [{ id: "n1", label: inferTitle(query), type: "topic" }];

  const edges: ConnectionEdge[] = Array.isArray(graph.edges)
    ? graph.edges.map((item) => {
        const edge = (item || {}) as JsonRecord;
        return {
          source: String(edge.source || "n1"),
          target: String(edge.target || "n1"),
          label: String(edge.label || "possible connection"),
          relationType: String(edge.relationType || "possible_influence") as ConnectionEdge["relationType"],
          confidence: score(edge.confidence, 60),
        };
      })
    : [];

  const timelineEvents: TimelineEvent[] = Array.isArray(parsed.timelineEvents)
    ? parsed.timelineEvents.map((item, index) => {
        const event = (item || {}) as JsonRecord;
        return {
          id: String(event.id || `t${index + 1}`),
          title: String(event.title || "Timeline item"),
          dateLabel: String(event.dateLabel || "Date unknown"),
          description: String(event.description || ""),
          sourceIds: arr(event.sourceIds),
          confidence: score(event.confidence, 70),
        };
      })
    : [];

  const geographyPoints: GeographyPoint[] = Array.isArray(parsed.geographyPoints)
    ? parsed.geographyPoints.map((item, index) => {
        const point = (item || {}) as JsonRecord;
        return {
          id: String(point.id || `g${index + 1}`),
          name: String(point.name || "Unknown place"),
          lat: Number(point.lat) || 0,
          lng: Number(point.lng) || 0,
          region: String(point.region || ""),
          period: String(point.period || ""),
          culturalElements: arr(point.culturalElements),
          sourceIds: arr(point.sourceIds),
          significance: String(point.significance || ""),
        };
      })
    : [];

  const culturalFlows: CulturalFlow[] = Array.isArray(parsed.culturalFlows)
    ? parsed.culturalFlows.map((item, index) => {
        const flow = (item || {}) as JsonRecord;
        return {
          id: String(flow.id || `f${index + 1}`),
          from: String(flow.from || "g1"),
          to: String(flow.to || "g1"),
          flowType: String(flow.flowType || "artistic_influence") as CulturalFlow["flowType"],
          label: String(flow.label || "Possible cultural flow"),
          confidence: boundedFraction(flow.confidence, 0.5),
          evidence: String(flow.evidence || "Requires verification."),
        };
      })
    : [];

  return {
    title: String(parsed.title || workspace.title),
    summary: String(parsed.summary || workspace.summary),
    keyQuestions: arr(parsed.keyQuestions).slice(0, 5),
    keyTerms: Array.isArray(parsed.keyTerms)
      ? parsed.keyTerms.map((item) => {
          const term = (item || {}) as JsonRecord;
          return { term: String(term.term || ""), definition: String(term.definition || "") };
        }).filter((item) => item.term && item.definition)
      : workspace.keyTerms,
    sourceRecords,
    evidenceCards,
    connectionGraph: { nodes, edges },
    timelineEvents,
    geographyPoints,
    culturalFlows,
    generatedImageSvg: generatedTopicSvg(query),
    studyModule: normalizeStudy(parsed.studyModule, query),
    lessonPack: normalizeLesson(parsed.lessonPack, query),
    status: {
      sourcesLoaded: sourceRecords.length,
      evidenceCards: evidenceCards.length,
      connectionsMapped: edges.length,
      lessonReady: true,
      aiMode: "enriched",
    },
  };
}

export async function generateStudyWithOpenAI(topic: string, difficulty: string, mode: string) {
  const prompt = `Return only JSON for a ChronoLens StudyModule:
{
  "overview": "4 engaging paragraphs for students",
  "keyTerms": [{"term":"...","definition":"..."}],
  "sourceDetectiveClues": ["..."],
  "whatWeKnow": ["..."],
  "whatWeInfer": ["..."],
  "misconceptions": ["..."],
  "quiz": [{"question":"...","answer":"..."}],
  "furtherReadingSourceIds": []
}
Use cautious language and keep claims about ${topic} honest. Difficulty: ${difficulty}. Mode: ${mode}.`;
  const parsed = await callOpenAIJson<JsonRecord>(prompt, topic, 2200);
  return parsed ? normalizeStudy(parsed, topic) : fallbackStudyModule(topic, difficulty, mode);
}

export async function generateLessonWithOpenAI(
  topic: string,
  classLevel: string,
  duration: string,
  learningGoal: string,
) {
  const prompt = `Return only JSON for a ChronoLens LessonPack:
{
  "objective": "...",
  "starterQuestion": "...",
  "activity": "...",
  "mapTimelineActivity": "...",
  "discussionQuestions": ["..."],
  "quizQuestions": ["..."],
  "rubric": ["..."],
  "homework": "...",
  "extensionActivity": "..."
}
Topic: ${topic}. Class level: ${classLevel}. Duration: ${duration}. Learning goal: ${learningGoal}. Use cautious, evidence-based cultural teaching language.`;
  const parsed = await callOpenAIJson<JsonRecord>(prompt, topic, 1800);
  return parsed ? normalizeLesson(parsed, topic) : fallbackLessonPack(topic, classLevel, duration, learningGoal);
}

export async function enrichWorkspaceWithOpenAI(workspace: Workspace): Promise<Partial<Workspace> | null> {
  const generated = await generateWorkspaceContent(workspace.query, workspace);
  if (!generated) return null;
  return {
    ...generated,
    id: workspace.id,
    query: workspace.query,
    mode: workspace.mode,
    lensType: workspace.lensType,
    createdAt: workspace.createdAt,
    uploadedImageDataUrl: workspace.uploadedImageDataUrl,
  };
}

export async function analyzeImageLabelsWithOpenAI(workspace: Workspace) {
  if (!process.env.OPENAI_API_KEY) return null;
  void workspace;
  return null;
}
