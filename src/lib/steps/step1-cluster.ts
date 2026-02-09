import { streamText } from "ai";
import { STEP_MODELS } from "../providers";
import { clusterPrompt } from "../prompts";

export async function runClustering(
  keywords: string[],
  onDelta?: (delta: string) => Promise<void>,
): Promise<string> {
  const { textStream, text } = streamText({
    model: STEP_MODELS.cluster,
    prompt: clusterPrompt(keywords),
    temperature: 0.3,
  });
  for await (const delta of textStream) {
    if (onDelta) await onDelta(delta);
  }
  return await text;
}
