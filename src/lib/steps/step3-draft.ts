import { streamText } from "ai";
import { STEP_MODELS } from "../providers";
import { draftPrompt } from "../prompts";
import type { ArticleType } from "./types";

export async function runDraft(
  outline: string,
  articleType: ArticleType,
  tone?: string,
  style?: string,
  wordCount?: string,
  audience?: string,
  onDelta?: (delta: string) => Promise<void>,
): Promise<string> {
  const { textStream, text } = streamText({
    model: STEP_MODELS.draft,
    prompt: draftPrompt(outline, articleType, tone, style, wordCount, audience),
    temperature: 0.7,
  });
  for await (const delta of textStream) {
    if (onDelta) await onDelta(delta);
  }
  return await text;
}
