<div align="center">

# Keypilot

**AI-powered SEO article generator that transforms keyword CSVs into publication-ready articles through a 5-step LLM pipeline with real-time streaming.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-6-000000?style=flat&logo=vercel&logoColor=white)](https://sdk.vercel.ai/)
[![Deploy](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://try-keypilot.vercel.app/)

[Live Demo](https://try-keypilot.vercel.app/) &middot; [Report Bug](https://github.com/pradhankukiran/keypilot/issues) &middot; [Request Feature](https://github.com/pradhankukiran/keypilot/issues)

</div>

---

## Overview

Keypilot takes a CSV of keywords (up to 500), runs them through five sequential LLM steps, and streams each step's output in real time — from raw keywords to a polished, SEO-optimized article ready for publishing.

Each step uses a purpose-selected model and temperature tuned for the task:

| Step | Task | Model | Provider |
|------|------|-------|----------|
| **1. Cluster** | Group keywords into 3–7 topical clusters | Llama 3.1 8B | Cerebras |
| **2. Outline** | Generate a structured article outline | Llama 3.3 70B | Groq |
| **3. Draft** | Write the full article from the outline | Llama 3.3 70B | Groq |
| **4. Refine** | Edit for flow, readability, and consistency | GPT-OSS 120B | Cerebras |
| **5. Polish** | Final grammar, formatting, and keyword pass | GPT-OSS 120B | OpenRouter |

## Features

- **Multi-provider LLM pipeline** — Different models optimized for each step
- **Real-time streaming** — SSE-based token streaming with live UI updates
- **Drag-and-drop CSV upload** — With automatic deduplication and preview
- **Configurable output** — Article type, length (500–4000 words), tone, style, and audience
- **Step-by-step visibility** — Auto-advancing tabs showing each pipeline stage
- **One-click export** — Copy to clipboard or download as markdown
- **Dark mode** — Full dark mode support
- **Cancellation** — Graceful pipeline abort at any point

## Getting Started

### Prerequisites

- Node.js 18+
- API keys for [Groq](https://console.groq.com/), [Cerebras](https://cloud.cerebras.ai/), and [OpenRouter](https://openrouter.ai/)

### Setup

```bash
git clone https://github.com/pradhankukiran/keypilot.git
cd keypilot
npm install
```

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_key
CEREBRAS_API_KEY=your_cerebras_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration Options

| Option | Description | Examples |
|--------|-------------|---------|
| **Article Type** | Format of the generated article | How-to guide, listicle, comparison, ultimate guide, product roundup |
| **Target Length** | Approximate word count | 500 – 4,000 words |
| **Tone** | Voice of the article | Professional, casual, authoritative |
| **Style** | Writing approach | Data-driven, narrative, conversational |
| **Target Audience** | Intended readers | Small business owners, beginner developers |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI** | React 19, Tailwind CSS v4 |
| **Language** | TypeScript 5 (strict mode) |
| **AI** | Vercel AI SDK v6 (`streamText`) |
| **LLM Providers** | Cerebras, Groq, OpenRouter |
| **Markdown** | react-markdown + remark-gfm |
| **CSV Parsing** | PapaParse |
| **Streaming** | Server-Sent Events (SSE) |
| **Deployment** | Vercel (serverless) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main UI
│   ├── layout.tsx               # Root layout
│   └── api/generate/route.ts    # SSE streaming endpoint
├── components/
│   ├── PipelineForm.tsx         # CSV upload + config form
│   ├── StepTabs.tsx             # Pipeline progress tabs
│   ├── ArticleOutput.tsx        # Final article display
│   ├── MarkdownRenderer.tsx     # Prose markdown renderer
│   └── CsvPreview.tsx           # Keyword preview chips
├── hooks/
│   └── usePipeline.ts           # Pipeline state management
└── lib/
    ├── pipeline.ts              # Pipeline orchestration
    ├── prompts.ts               # System prompts per step
    ├── providers.ts             # LLM provider config
    ├── stream-utils.ts          # SSE utilities
    ├── csv-parser.ts            # CSV parsing + dedup
    └── steps/                   # Individual step implementations
        ├── step1-cluster.ts
        ├── step2-outline.ts
        ├── step3-draft.ts
        ├── step4-refine.ts
        └── step5-polish.ts
```

## License

This project is open source and available under the [MIT License](LICENSE).
