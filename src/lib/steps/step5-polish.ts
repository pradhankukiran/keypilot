import { streamText } from "ai";
import { STEP_MODELS } from "../providers";
import { polishPrompt } from "../prompts";

export async function runPolish(
  refined: string,
  onDelta?: (delta: string) => Promise<void>,
): Promise<string> {
  const { textStream, text } = streamText({
    model: STEP_MODELS.polish,
    prompt: polishPrompt(refined),
    temperature: 0.6,
  });
  for await (const delta of textStream) {
    if (onDelta) await onDelta(delta);
  }
  return await text;
}
