import { streamText } from "ai";
import { STEP_MODELS } from "../providers";
import { outlinePrompt } from "../prompts";
import type { ArticleType } from "./types";

export async function runOutline(
  clusters: string,
  articleType: ArticleType,
  tone?: string,
  style?: string,
  wordCount?: string,
  audience?: string,
  onDelta?: (delta: string) => Promise<void>,
): Promise<string> {
  const { textStream, text } = streamText({
    model: STEP_MODELS.outline,
    prompt: outlinePrompt(clusters, articleType, tone, style, wordCount, audience),
    temperature: 0.5,
  });
  for await (const delta of textStream) {
    if (onDelta) await onDelta(delta);
  }
  return await text;
}
