export type UserMode =
  | "student"
  | "teacher"
  | "researcher"
  | "museum_educator";

export type LensType =
  | "artifact"
  | "visual_art"
  | "music"
  | "performance"
  | "architecture"
  | "textile"
  | "manuscript"
  | "oral_tradition"
  | "topic";

export type SourceProvider =
  | "demo"
  | "openalex"
  | "library_of_congress"
  | "met_museum"
  | "musicbrainz"
  | "wikidata"
  | "europeana"
  | "smithsonian"
  | "crossref";

export type SourceRecord = {
  id: string;
  provider: SourceProvider;
  title: string;
  type:
    | "image"
    | "book"
    | "article"
    | "music"
    | "museum_object"
    | "manuscript"
    | "map"
    | "video"
    | "audio"
    | "other";
  creator?: string;
  institution?: string;
  collection?: string;
  dateLabel?: string;
  period?: string;
  region?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  rights?: string;
  description?: string;
  relevanceScore: number;
};

export type ClaimClassification =
  | "fact"
  | "context"
  | "possible_connection"
  | "hypothesis"
  | "analogy"
  | "needs_review";

export type EvidenceCard = {
  id: string;
  claim: string;
  classification: ClaimClassification;
  evidence: string[];
  sourceIds: string[];
  confidence: number;
  uncertainty: string;
  counterEvidence?: string[];
  needsExpertReview: boolean;
  visualRegionId?: string;
};

export type VisualRegion = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  observation: string;
};

export type ArchitectureLayer = {
  id: string;
  name: string;
  description: string;
  material: string;
  period: string;
  function: string;
  yPosition: number;
  height: number;
  color: string;
};

export type ConnectionNode = {
  id: string;
  label: string;
  type:
    | "topic"
    | "artifact"
    | "artwork"
    | "music"
    | "dance"
    | "textile"
    | "manuscript"
    | "place"
    | "period"
    | "source"
    | "research";
  explanation?: string;
  evidenceCardIds?: string[];
  sourceIds?: string[];
  confidence?: number;
  uncertainty?: string;
};

export type ConnectionEdge = {
  source: string;
  target: string;
  label: string;
  relationType:
    | "direct_evidence"
    | "shared_motif"
    | "same_region"
    | "same_period"
    | "possible_influence"
    | "analogy_only";
  confidence: number;
};

export type TimelineEvent = {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  sourceIds?: string[];
  confidence: number;
};

export type StudyModule = {
  overview: string;
  keyTerms: { term: string; definition: string }[];
  sourceDetectiveClues: string[];
  whatWeKnow: string[];
  whatWeInfer: string[];
  misconceptions: string[];
  expertsDebate?: string[];
  quiz: { question: string; answer: string }[];
  furtherReadingSourceIds: string[];
};

export type LessonPack = {
  objective: string;
  starterQuestion: string;
  activity: string;
  mapTimelineActivity: string;
  discussionQuestions: string[];
  quizQuestions: string[];
  rubric: string[];
  homework: string;
  extensionActivity: string;
};

export type Discovery = {
  id: string;
  title: string;
  provider: string;
  dateLabel: string;
  whyItMatters: string;
  relevanceScore: number;
  externalUrl?: string;
};

export type GeographyPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  period: string;
  culturalElements: string[];
  sourceIds: string[];
  significance: string;
};

export type CulturalFlow = {
  id: string;
  from: string;
  to: string;
  flowType:
    | "trade_route"
    | "colonial_influence"
    | "migration"
    | "religious_transmission"
    | "artistic_influence";
  label: string;
  confidence: number;
  evidence: string;
};

export type Workspace = {
  id: string;
  title: string;
  query: string;
  mode: UserMode;
  lensType?: LensType;
  createdAt: string;
  summary: string;
  keyQuestions: string[];
  keyTerms: { term: string; definition: string }[];
  sourceRecords: SourceRecord[];
  evidenceCards: EvidenceCard[];
  connectionGraph: {
    nodes: ConnectionNode[];
    edges: ConnectionEdge[];
  };
  timelineEvents: TimelineEvent[];
  visualRegions: VisualRegion[];
  generatedImageSvg?: string;
  uploadedImageDataUrl?: string;
  studyModule: StudyModule;
  lessonPack: LessonPack;
  discoveries: Discovery[];
  geographyPoints?: GeographyPoint[];
  culturalFlows?: CulturalFlow[];
  architectureLayers?: ArchitectureLayer[];
  status: {
    sourcesLoaded: number;
    evidenceCards: number;
    connectionsMapped: number;
    lessonReady: boolean;
    aiMode: "enriched" | "fallback" | "unavailable" | "quota_exceeded";
  };
};

export type CreateWorkspaceRequest = {
  query: string;
  mode?: UserMode;
  lensType?: LensType;
  sourceRecords?: SourceRecord[];
  uploadedImageDataUrl?: string;
};

export type WorkspaceTab =
  | "atlas"
  | "sources"
  | "evidence"
  | "connections"
  | "timeline"
  | "geography"
  | "image"
  | "architecture"
  | "study"
  | "infographics"
  | "teach"
  | "discoveries"
  | "export";
