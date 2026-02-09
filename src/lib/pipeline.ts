import type { PipelineEvent, PipelineInput, StepName } from "./steps/types";
import { runClustering } from "./steps/step1-cluster";
import { runOutline } from "./steps/step2-outline";
import { runDraft } from "./steps/step3-draft";
import { runRefine } from "./steps/step4-refine";
import { runPolish } from "./steps/step5-polish";
import { formatSSE } from "./stream-utils";

export async function runPipeline(
  input: PipelineInput,
  writer: WritableStreamDefaultWriter<Uint8Array>,
): Promise<void> {
  const encoder = new TextEncoder();

  async function write(event: PipelineEvent) {
    try {
      await writer.write(encoder.encode(formatSSE(event)));
    } catch {
      // Stream closed (client disconnected) — swallow
    }
  }

  const deltaWriter = (step: StepName) => async (delta: string) => {
    await write({ type: "step-delta", step, delta });
  };

  const pipelineStart = Date.now();

  async function runStep<T>(
    name: StepName,
    fn: () => Promise<T>,
  ): Promise<T> {
    await write({ type: "step-start", step: name });
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      await write({
        type: "step-complete",
        step: name,
        output: String(result),
        duration,
      });
      return result;
    } catch (err) {
      await write({
        type: "step-error",
        step: name,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  try {
    const clusters = await runStep("cluster", () =>
      runClustering(input.keywords, deltaWriter("cluster")),
    );

    const outline = await runStep("outline", () =>
      runOutline(clusters, input.articleType, input.tone, input.style, input.wordCount, input.audience, deltaWriter("outline")),
    );

    const draft = await runStep("draft", () =>
      runDraft(outline, input.articleType, input.tone, input.style, input.wordCount, input.audience, deltaWriter("draft")),
    );

    const refined = await runStep("refine", () =>
      runRefine(draft, deltaWriter("refine")),
    );

    const article = await runStep("polish", () =>
      runPolish(refined, deltaWriter("polish")),
    );

    const totalDuration = Date.now() - pipelineStart;
    await write({ type: "pipeline-complete", article, totalDuration });
  } catch (err) {
    await write({
      type: "pipeline-error",
      error: err instanceof Error ? err.message : String(err),
    });
  } finally {
    try {
      await writer.close();
    } catch {
      // Stream already closed
    }
  }
}
