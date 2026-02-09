"use client";

import { useState, useEffect, useRef } from "react";
import type { StepState, StepName } from "@/lib/steps/types";
import { STEP_ORDER } from "@/lib/steps/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ArticleOutput } from "./ArticleOutput";

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const statusIndicator: Record<StepState["status"], React.ReactNode> = {
  pending: (
    <div className="h-2 w-2 rounded-full bg-cream-300 dark:bg-cream-600" />
  ),
  running: (
    <div className="h-2 w-2 rounded-full border border-accent-500 border-t-transparent animate-spin" />
  ),
  done: (
    <div className="h-2 w-2 rounded-full bg-success-500" />
  ),
  error: (
    <div className="h-2 w-2 rounded-full bg-danger-500" />
  ),
};

export function StepTabs({
  steps,
  streamingOutput,
  totalDuration,
}: {
  steps: StepState[];
  streamingOutput: Record<StepName, string>;
  totalDuration: number | null;
}) {
  const [activeTab, setActiveTab] = useState<StepName>("cluster");
  const [userOverride, setUserOverride] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-advance to the currently running step (unless user clicked a tab)
  useEffect(() => {
    if (userOverride) return;
    const running = steps.find((s) => s.status === "running");
    if (running) setActiveTab(running.name);
  }, [steps, userOverride]);

  // Reset user override when a new pipeline run starts (all pending)
  useEffect(() => {
    if (steps.every((s) => s.status === "pending")) {
      setUserOverride(false);
    }
  }, [steps]);

  const handleTabClick = (name: StepName) => {
    setActiveTab(name);
    setUserOverride(true);
  };

  const hasActivity = steps.some((s) => s.status !== "pending");
  if (!hasActivity) return null;

  const activeStep = steps.find((s) => s.name === activeTab)!;
  const isStreaming = activeStep.status === "running";
  const isPolishDone = activeTab === "polish" && activeStep.status === "done" && activeStep.output;

  // Content to display: streaming text if running, final output if done
  const displayContent =
    isStreaming
      ? streamingOutput[activeTab]
      : activeStep.output || "";

  return (
    <div className="rounded-xl border border-cream-200 dark:border-cream-800 bg-card">
      {/* Tab bar */}
      <div className="flex border-b border-cream-200 dark:border-cream-800 overflow-x-auto">
        {STEP_ORDER.map((name) => {
          const step = steps.find((s) => s.name === name)!;
          const isActive = activeTab === name;
          return (
            <button
              key={name}
              onClick={() => handleTabClick(name)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-accent-500 text-accent-600 dark:text-accent-400"
                  : "border-transparent text-cream-500 dark:text-cream-400 hover:text-cream-700 dark:hover:text-cream-300 hover:border-cream-300 dark:hover:border-cream-600"
              }`}
            >
              {statusIndicator[step.status]}
              <span>{step.label}</span>
              {step.duration != null && (
                <span className="text-xs text-cream-400 dark:text-cream-500">
                  {formatDuration(step.duration)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div ref={contentRef} className="p-5 min-h-[200px]">
        {activeStep.status === "pending" ? (
          <p className="text-sm text-cream-400 dark:text-cream-500 italic">
            Waiting to start...
          </p>
        ) : activeStep.status === "error" ? (
          <div className="rounded-lg border border-danger-200 dark:border-danger-900 bg-danger-50 dark:bg-danger-950 p-4">
            <p className="text-sm text-danger-700 dark:text-danger-400">
              {activeStep.error}
            </p>
          </div>
        ) : isPolishDone ? (
          <ArticleOutput
            article={activeStep.output!}
            totalDuration={totalDuration}
            isStreaming={false}
          />
        ) : (
          <div className="relative">
            {displayContent ? (
              <MarkdownRenderer content={displayContent} />
            ) : (
              <p className="text-sm text-cream-400 dark:text-cream-500 italic">
                Generating...
              </p>
            )}
            {isStreaming && displayContent && (
              <span className="inline-block w-2 h-4 bg-accent-500 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
