import AppFrame from "@/components/AppFrame";

const endpoints = [
  ["POST", "/api/workspaces", "Create a workspace from a topic, mode, lens, optional sources, and optional uploaded image data URL."],
  ["GET", "/api/workspaces/[id]", "Return a workspace from the in-memory store."],
  ["POST", "/api/search-sources", "Search OpenAlex, Library of Congress, the Met, and other optional source adapters."],
  ["POST", "/api/generate-study", "Generate a standalone StudyModule for the Study page."],
  ["POST", "/api/generate-lesson", "Generate a standalone LessonPack for the Teach page."],
  ["GET", "/api/latest-discoveries", "Return recent research/source-watch items with contextual fallback."],
  ["POST", "/api/workspaces/[id]/image-analysis", "Return deterministic visual regions for Image Lab."],
  ["POST", "/api/workspaces/[id]/ai-enrich", "Manually run optional OpenAI enrichment if configured."],
  ["POST", "/api/workspaces/[id]/lesson", "Regenerate a lesson pack."],
  ["POST", "/api/workspaces/[id]/study", "Regenerate a study module."],
];

const exampleRequest = {
  query: "Teach me about Islamic geometric patterns in architecture.",
  mode: "student",
  lensType: "topic",
};

const exampleResponse = {
  id: "workspace-islamic-geometric-patterns-in-architecture-...",
  title: "Islamic geometric patterns in architecture",
  status: {
    sourcesLoaded: 0,
    evidenceCards: 0,
    connectionsMapped: 0,
    lessonReady: true,
    aiMode: "enriched",
  },
};

export default function ApiDocsPage() {
  return (
    <AppFrame>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-medium text-[#38bdf8]">Developer mode</p>
        <h1 className="mt-3 font-serif text-5xl text-white">ChronoLens API Docs</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#a9a59b]">
          ChronoLens uses the query you send. Without OpenAI it returns a minimal contextual workspace plus any live source-adapter results; with OpenAI it enriches the workspace once and caches it in memory.
        </p>
        <div className="mt-8 grid gap-4">
          {endpoints.map(([method, path, description]) => (
            <article key={path} className="rounded-3xl border border-[#2a2d31] bg-[#101214] p-5">
              <h2 className="text-xl font-semibold text-white">
                <span className="text-[#d4a857]">{method}</span> {path}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#a9a59b]">{description}</p>
            </article>
          ))}
          <article className="rounded-3xl border border-[#2a2d31] bg-[#101214] p-5">
            <h2 className="text-xl font-semibold text-white">Example request / response</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <pre className="overflow-auto rounded-2xl bg-[#17191c] p-4 text-xs leading-5 text-[#a9a59b]">
                {JSON.stringify(exampleRequest, null, 2)}
              </pre>
              <pre className="overflow-auto rounded-2xl bg-[#17191c] p-4 text-xs leading-5 text-[#a9a59b]">
                {JSON.stringify(exampleResponse, null, 2)}
              </pre>
            </div>
          </article>
        </div>
      </section>
    </AppFrame>
  );
}
