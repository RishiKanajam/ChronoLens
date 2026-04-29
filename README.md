# ChronoLens 🔭

### Cultural Learning + Research OS

**One query. Ten research tools. Every claim labelled honestly.**

Built solo at the [OpenAI Codex Hackathon — Sydney](https://lu.ma/openai-codex-hackathon-sydney) · April 29, 2026 · UTS Startups, Ultimo

🌐 **Live Demo:** [chrono-lens-six.vercel.app](https://chrono-lens-six.vercel.app)
📹 **Demo Video:** [[YouTube Link](https://youtu.be/pUtMBqYyRVI)]
🧑‍💻 **Built by:** [Rishi Kanajam](https://github.com/RishiKanajam)

-----

## The Problem

AI tools generate cultural content freely — but they don’t tell you what’s a verified fact, what’s an interpretation, and what’s a guess. Students cite AI hallucinations as research. Teachers can’t trust generated lesson content. Researchers lose hours verifying AI claims.

Cultural knowledge deserves better than “sounds about right.”

## What ChronoLens Does

Type any cultural question. ChronoLens builds a complete research workspace where **every claim is classified:**

|Classification           |Meaning                                                 |
|-------------------------|--------------------------------------------------------|
|✅ **Fact**               |Documented and source-verified                          |
|📎 **Context**            |Background information, generally accepted              |
|🔗 **Possible Connection**|Interesting link, not fully proven                      |
|💡 **Hypothesis**         |Interpretive claim, needs more evidence                 |
|⚠️ **Needs Review**       |Culturally sensitive or uncertain, requires expert input|

No AI hallucination disguised as truth. Every claim linked to its sources. Every uncertainty made visible.

## Features

### 🔬 Research Workspace

Ten analysis tabs from a single query:

- **Atlas** — High-level cultural context, key questions, art forms involved
- **Sources** — Real records from Met Museum, Library of Congress, OpenAlex, MusicBrainz
- **Evidence** — Every claim classified as fact, hypothesis, or needs review
- **Connections** — Knowledge graph showing cultural relationships with confidence scores
- **Timeline** — Chronological events with source links
- **Geography** — Cultural spread mapped across civilizations with transmission flows
- **Image Lab** — Visual analysis with bounding boxes, enhanced view, and interactive region selection
- **Infographics** — Auto-generated visual cards for presentations and classrooms
- **Study** — Complete student learning module with quizzes
- **Teach** — Ready-made lesson packs with rubrics and activities

### 📚 Study Mode

Students enter a topic and get a structured learning module — no uploads, no complexity:

- Start Here overview
- Key Terms
- Source Detective clues
- What We Know vs What We Infer
- Common Misconceptions
- Interactive Quiz with reveal answers
- Further Reading linked to real sources

### 🍎 Teach Mode

Teachers generate a complete lesson pack in one click:

- Learning objective aligned to curriculum
- Starter question
- Classroom activity
- Discussion questions
- Quiz with answers
- Assessment rubric
- Homework and extension activities
- Export to PDF or PowerPoint

### 🏛️ Archive Search

Real sources from real institutions — not AI-generated content:

- **OpenAlex** — 4.2M academic papers (free API, no key)
- **Library of Congress** — 2.1M items (free API, no key)
- **Met Museum** — 35K+ items (free API, no key)
- **MusicBrainz** — 1.8M recordings (free API, no key)
- **Europeana** — 50M items (optional key)
- **Smithsonian** — 155M items (optional key)

### 🖼️ Image Lab

Upload any artifact image or use generated visuals:

- Original, Enhanced, Boxes, and Comparison viewing modes
- AI-powered bounding boxes identifying motifs, scripts, borders, materials
- **Select Area** — draw a rectangle on any region and get instant cultural analysis
- Every observation becomes a linkable evidence card

### 📊 Infographics

Auto-generated visual cards ready for presentations:

- Key Facts card
- Timeline Snapshot
- Did You Know highlights
- Connections Map mini-graph
- Download as PNG or export as PDF

### 📤 Export

- Export full workspace as PDF
- Export lesson pack as PowerPoint (.pptx)
- Copy summary, JSON, lesson, study notes, or bibliography
- Full API response inspector for developers

-----

## Why “Not Possible Without Codex”

I built ChronoLens solo in ~5 hours. The project contains:

- 10+ workspace analysis tabs
- 6 real archive source adapters
- OpenAI-powered evidence generation with honest classification
- Interactive knowledge graph
- Image analysis with bounding boxes
- PDF and PowerPoint export
- Full API with documentation
- Responsive dark-theme UI

Codex wrote the source adapters, generated the workspace components, debugged TypeScript errors, scaffolded the API routes, and built the export logic. Without Codex, this is a month-long team project. With Codex, one developer, one afternoon.

-----

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI API (GPT-4.1) with graceful fallback
- **Source APIs:** OpenAlex, Library of Congress, Met Museum, MusicBrainz (all free)
- **Export:** jsPDF + html2canvas (PDF), pptxgenjs (PowerPoint)
- **Icons:** lucide-react
- **Hosting:** Vercel
- **Build Tool:** OpenAI Codex CLI

-----

## Quick Start

```bash
git clone https://github.com/RishiKanajam/ChronoLens.git
cd ChronoLens
npm install
```

Create `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here   # Optional — app works without it
```

```bash
npm run dev
# Open http://localhost:3000
```

### Environment Variables

|Variable             |Required|Description                                                          |
|---------------------|--------|---------------------------------------------------------------------|
|`OPENAI_API_KEY`     |Optional|Enables AI-enriched workspaces. Without it, app runs in fallback mode|
|`OPENAI_MODEL`       |Optional|Default: gpt-4.1                                                     |
|`EUROPEANA_API_KEY`  |Optional|Enables Europeana source adapter                                     |
|`SMITHSONIAN_API_KEY`|Optional|Enables Smithsonian source adapter                                   |

-----

## How It Works

```
User Query: "How did Islamic geometric patterns spread across civilizations?"
    │
    ▼
┌─────────────────────────────────────────────┐
│          OpenAI Evidence Generator           │
│  Generates claims with HONEST classifications│
│  Fact · Context · Hypothesis · Needs Review  │
└─────────────────────────────────────────────┘
    │
    ├──→ Source Adapters (Met, LoC, OpenAlex, MusicBrainz)
    │    Real archive records, not generated content
    │
    ├──→ Evidence Cards with classification + confidence
    │
    ├──→ Knowledge Graph with relationship types
    │
    ├──→ Geography with cultural transmission flows
    │
    ├──→ Study Module (student-facing)
    │
    ├──→ Lesson Pack (teacher-facing)
    │
    └──→ Image Analysis with bounding boxes
              │
              ▼
         Full Research Workspace
         10 tabs · Every claim sourced · Every uncertainty visible
```

-----

## What Was Built During the Hackathon

**All of the following was built on-site at UTS Startups on April 29, 2026:**

- Complete Next.js application with App Router
- All workspace tabs (Atlas, Sources, Evidence, Connections, Timeline, Geography, Image Lab, Study, Teach, Infographics, Export)
- OpenAI integration with evidence classification system
- 6 real archive source adapters
- Image Lab with bounding boxes and interactive region selection
- Study and Teach standalone page flows
- PDF and PowerPoint export
- Landing page, Archive page, API documentation
- Vercel deployment

**Nothing was pre-built.** The project was started from scratch at the hackathon.

-----

## Social Impact

ChronoLens is designed for:

- **Students** who need to distinguish AI facts from AI guesses in their research
- **Teachers** who want curriculum-ready lesson packs they can trust
- **Researchers** who need source-linked evidence cards, not AI paragraphs
- **Museums and cultural institutions** who want to make collections explorable and teachable
- **Indigenous and cultural heritage groups** who need their knowledge represented accurately, with appropriate uncertainty labels and expert review flags

Cultural knowledge is too important to be treated as “content.” ChronoLens treats it as evidence.

-----

## Team

**Rishi Kanajam** — Solo builder

- Architecture, AI integration, source adapters, UI, deployment
- [GitHub](https://github.com/RishiKanajam) · [LinkedIn](https://linkedin.com/in/rishikanajam)

-----

## License

MIT

-----

*Built with OpenAI Codex at the Sydney Codex Hackathon, April 29, 2026*
