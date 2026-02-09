"use client";

import { PipelineForm } from "@/components/PipelineForm";
import { StepTabs } from "@/components/StepTabs";
import { usePipeline } from "@/hooks/usePipeline";

export default function Home() {
  const { steps, article, isRunning, error, totalDuration, streamingOutput, generate, cancel, reset } =
    usePipeline();

  const hasResults = article || steps.some((s) => s.status !== "pending");

  return (
    <main className="min-h-screen bg-cream-50 dark:bg-cream-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-cream-900 dark:text-cream-100">
            Keypilot
          </h1>
          <p className="mt-1 text-cream-500 dark:text-cream-400">
            Generate SEO articles from keyword CSVs using a 5-step LLM pipeline.
          </p>
        </div>

        <div className="space-y-6">
          {/* Input card */}
          <div className="mx-auto max-w-3xl rounded-xl border border-cream-200 dark:border-cream-800 bg-card p-5">
            <PipelineForm
              onSubmit={generate}
              isRunning={isRunning}
              onCancel={cancel}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-danger-200 dark:border-danger-900 bg-danger-50 dark:bg-danger-950 p-4">
              <p className="text-sm text-danger-700 dark:text-danger-400">
                {error}
              </p>
            </div>
          )}

          {/* Step tabs with streaming output */}
          <StepTabs
            steps={steps}
            streamingOutput={streamingOutput}
            totalDuration={totalDuration}
          />

          {hasResults && !isRunning && (
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="text-sm text-cream-500 hover:text-cream-800 dark:hover:text-cream-200 underline underline-offset-2 transition-colors"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
