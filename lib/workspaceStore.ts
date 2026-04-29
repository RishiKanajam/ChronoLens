import { generateWorkspaceContent, enrichWorkspaceWithOpenAI } from "@/lib/ai/openai";
import { createFallbackWorkspace, enrichFallbackWorkspaceSections, fallbackLessonPack, fallbackStudyModule } from "@/lib/contextualFallback";
import { searchSources } from "@/lib/sourceSearch";
import {
  CreateWorkspaceRequest,
  EvidenceCard,
  LessonPack,
  SourceRecord,
  StudyModule,
  Workspace,
} from "@/lib/types";

const globalForWorkspaces = globalThis as unknown as {
  chronoLensWorkspaces?: Map<string, Workspace>;
};

function store() {
  if (!globalForWorkspaces.chronoLensWorkspaces) {
    globalForWorkspaces.chronoLensWorkspaces = new Map();
  }
  return globalForWorkspaces.chronoLensWorkspaces;
}

function uniqueSources(sources: SourceRecord[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.provider}:${source.title}:${source.externalUrl || ""}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function listWorkspaces() {
  return Array.from(store().values());
}

export function getWorkspace(id: string) {
  const workspace = store().get(id);
  if (!workspace) return undefined;
  const needsFallbackSections =
    !workspace.evidenceCards.length ||
    !workspace.connectionGraph.edges.length ||
    !workspace.timelineEvents.length ||
    !workspace.geographyPoints?.length;
  if (!needsFallbackSections) return workspace;
  const hydrated = enrichFallbackWorkspaceSections(workspace);
  store().set(id, hydrated);
  return hydrated;
}

export function saveWorkspace(workspace: Workspace) {
  store().set(workspace.id, workspace);
  return workspace;
}

export async function createWorkspace(input: CreateWorkspaceRequest) {
  const query = input.query?.trim();
  if (!query) throw new Error("Workspace query is required.");

  const liveSources = uniqueSources([
    ...(input.sourceRecords || []),
    ...(await withTimeout(searchSources(query), 6500, [])),
  ]).slice(0, 16);

  const shell = createFallbackWorkspace(input, liveSources);

  if (process.env.OPENAI_API_KEY) {
    try {
      const generated = await withTimeout(generateWorkspaceContent(query, shell), 12000, null);
      if (generated) {
        return saveWorkspace({
          ...shell,
          ...generated,
          id: shell.id,
          query,
          mode: input.mode || shell.mode,
          lensType: input.lensType || shell.lensType,
          createdAt: shell.createdAt,
          uploadedImageDataUrl: input.uploadedImageDataUrl,
          sourceRecords: uniqueSources(generated.sourceRecords || liveSources),
          status: {
            ...shell.status,
            ...generated.status,
            sourcesLoaded: (generated.sourceRecords || liveSources).length,
          },
        });
      }
    } catch (err) {
      const isQuota = err instanceof Error && err.message === "quota_exceeded";
      console.warn(`[ChronoLens] OpenAI generation failed: ${isQuota ? "quota exceeded" : String(err)}`);
      if (isQuota) {
        return saveWorkspace({
          ...shell,
          status: { ...shell.status, aiMode: "quota_exceeded" },
        });
      }
    }
  }

  return saveWorkspace(shell);
}

export function updateWorkspace(id: string, patch: Partial<Workspace>) {
  const current = getWorkspace(id);
  if (!current) return undefined;
  return saveWorkspace({ ...current, ...patch });
}

export function addEvidenceFromSource(workspaceId: string, sourceId: string) {
  const current = getWorkspace(workspaceId);
  const source = current?.sourceRecords.find((s) => s.id === sourceId);
  if (!current || !source) return undefined;

  const card: EvidenceCard = {
    id: `ev-source-${sourceId}-${Date.now()}`,
    claim: `The source "${source.title}" may support research about "${current.title}".`,
    classification: "context",
    evidence: [
      source.description || "The selected source has metadata relevant to the workspace topic.",
      source.institution ? `Holding institution: ${source.institution}.` : "Institution metadata should be checked before use.",
    ],
    sourceIds: [source.id],
    confidence: source.relevanceScore,
    uncertainty: "Source relevance does not prove a cultural interpretation by itself.",
    counterEvidence: ["The record may use broad catalog terms or lack full provenance/context."],
    needsExpertReview: false,
  };

  return saveWorkspace({
    ...current,
    evidenceCards: [card, ...current.evidenceCards],
    status: { ...current.status, evidenceCards: current.evidenceCards.length + 1 },
  });
}

export function regenerateStudy(workspaceId: string, overrides?: Partial<StudyModule>) {
  const current = getWorkspace(workspaceId);
  if (!current) return undefined;
  return saveWorkspace({
    ...current,
    studyModule: {
      ...fallbackStudyModule(current.query),
      ...current.studyModule,
      ...overrides,
    },
  });
}

export function regenerateLesson(workspaceId: string, overrides?: Partial<LessonPack>) {
  const current = getWorkspace(workspaceId);
  if (!current) return undefined;
  return saveWorkspace({
    ...current,
    lessonPack: {
      ...fallbackLessonPack(current.query),
      ...current.lessonPack,
      ...overrides,
    },
    status: { ...current.status, lessonReady: true },
  });
}

export { enrichWorkspaceWithOpenAI };
