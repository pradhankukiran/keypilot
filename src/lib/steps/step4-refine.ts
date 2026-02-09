import { streamText } from "ai";
import { STEP_MODELS } from "../providers";
import { refinePrompt } from "../prompts";

export async function runRefine(
  draft: string,
  onDelta?: (delta: string) => Promise<void>,
): Promise<string> {
  const { textStream, text } = streamText({
    model: STEP_MODELS.refine,
    prompt: refinePrompt(draft),
    temperature: 0.5,
  });
  for await (const delta of textStream) {
    if (onDelta) await onDelta(delta);
  }
  return await text;
}
