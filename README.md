# Keypilot

Generate SEO articles from keyword CSVs using a 5-step LLM pipeline with real-time streaming.

## How It Works

Upload a CSV of keywords and configure your article preferences. Keypilot runs them through five sequential steps, streaming each step's output in real time:

1. **Cluster** — Groups keywords into topical clusters (Cerebras / Llama 3.1 8B)
2. **Outline** — Generates a structured article outline from the clusters (Groq / Llama 3.3 70B)
3. **Draft** — Writes the initial full article from the outline (Groq / Llama 3.3 70B)
4. **Refine** — Edits for flow, readability, and consistency (Cerebras / GPT-OSS 120B)
5. **Polish** — Final grammar, formatting, and keyword integration pass (OpenRouter / GPT-OSS 120B)

## Configuration Options

| Option | Description |
|---|---|
| Article Type | How-to guide, listicle, comparison, ultimate guide, product roundup |
| Target Length | ~500 to ~4,000 words |
| Tone | e.g. professional, casual, authoritative |
| Style | e.g. data-driven, narrative, conversational |
| Target Audience | e.g. small business owners, beginner developers |

## Getting Started

### Prerequisites

- Node.js 18+
- API keys for [Groq](https://console.groq.com/), [Cerebras](https://cloud.cerebras.ai/), and [OpenRouter](https://openrouter.ai/)

### Setup

```bash
git clone <repo-url>
cd keypilot
npm install
```

Create a `.env.local` file:

```
GROQ_API_KEY=your_groq_key
CEREBRAS_API_KEY=your_cerebras_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **AI SDK** — Vercel AI SDK v6 with `streamText`
- **Styling** — Tailwind CSS v4 with custom cream/accent theme
- **Streaming** — Server-Sent Events (SSE) with per-step token deltas
