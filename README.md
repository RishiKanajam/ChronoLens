# ChronoLens

ChronoLens is a hackathon MVP for a **Cultural Learning + Research OS**.

Core line: **Ask about culture. Explore the evidence. Turn it into study modules.**

ChronoLens helps students, teachers, researchers, and cultural heritage groups study culture across artifacts, art, music, performance, history, manuscripts, architecture, textiles, oral traditions, and cultural patterns.

It is not an AI art generator, AI music generator, or generic chatbot. It studies, preserves, compares, explains, and teaches culture.

## Topic-First Flow

Users can start with a question, not an upload:

- Study a cultural topic
- Build a teacher lesson
- Research an object or source
- Search archives
- Open a saved workspace

Uploads are optional. Deterministic demo data keeps every flow working without API keys.

## Main Features

- Split-screen workspace with conversational left panel and tabbed right workspace
- Atlas, Sources, Evidence, Connections, Timeline, Image Lab, Study, Teach, Discoveries, and Export tabs
- Evidence cards with claim classification, source links, confidence, uncertainty, and review flags
- Pattern Bridge graph for cultural connections
- Image Lab with deterministic generated images and visual region boxes
- Student study module with quiz reveal and read aloud
- Teacher lesson builder with regenerate, copy, PDF, and PPT export
- Latest discoveries / research watch using fallback data
- Client-side PDF export with jsPDF
- PPTX download flow for lesson/demo presentation material
- Optional OpenAI enrichment when `OPENAI_API_KEY` is present

## Social Impact

ChronoLens makes cultural interpretation more careful and teachable. It separates facts from possible connections, marks uncertain claims, and encourages expert or community review for sensitive cultural, religious, Indigenous, or community-specific topics.

## Source Adapters

Adapters normalize source records from:

- Demo data
- OpenAlex
- Library of Congress
- Met Museum API
- MusicBrainz
- Crossref
- Wikidata placeholder
- Europeana optional
- Smithsonian optional

If live APIs fail or keys are missing, adapters return empty arrays and the UI falls back to demo records.

## OpenAI Enrichment

Environment variables:

- `OPENAI_API_KEY` optional
- `OPENAI_MODEL` optional
- `EUROPEANA_API_KEY` optional
- `SMITHSONIAN_API_KEY` optional

OpenAI enrichment is attempted once when creating a workspace if a key exists, and can be run manually from the Export tab. If it fails, the workspace remains in fallback mode.

## Routes

- `/` opening query page
- `/study` student topic module creator
- `/teach` teacher lesson builder
- `/research` research/object/source workspace creator
- `/archive` source and archive search
- `/workspace/[workspaceId]` split-screen workspace
- `/api-docs` API documentation

## API

- `POST /api/workspaces`
- `GET /api/workspaces/[workspaceId]`
- `POST /api/search-sources`
- `POST /api/workspaces/[workspaceId]/study`
- `POST /api/workspaces/[workspaceId]/lesson`
- `POST /api/workspaces/[workspaceId]/image-analysis`
- `POST /api/workspaces/[workspaceId]/ai-enrich`
- `GET /api/latest-discoveries`

## Run

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

No database is required.
