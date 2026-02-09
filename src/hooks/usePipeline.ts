"use client";

import { useState, useCallback, useRef } from "react";
import type {
  StepState,
  StepName,
  PipelineEvent,
  ArticleType,
} from "@/lib/steps/types";
import { STEP_ORDER, STEP_LABELS } from "@/lib/steps/types";

function initialSteps(): StepState[] {
  return STEP_ORDER.map((name) => ({
    name,
    label: STEP_LABELS[name],
    status: "pending",
  }));
}

function initialStreamingOutput(): Record<StepName, string> {
  return { cluster: "", outline: "", draft: "", refine: "", polish: "" };
}

function parseSSEEvents(raw: string): PipelineEvent[] {
  const events: PipelineEvent[] = [];
  // Split each SSE frame into individual lines to handle merged chunks
  const lines = raw.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data: ")) continue;
    try {
      events.push(JSON.parse(trimmed.slice(6)));
    } catch {
      // skip malformed events
    }
  }
  return events;
}

export function usePipeline() {
  const [steps, setSteps] = useState<StepState[]>(initialSteps());
  const [article, setArticle] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [streamingOutput, setStreamingOutput] = useState<Record<StepName, string>>(initialStreamingOutput());
  const abortRef = useRef<AbortController | null>(null);

  const updateStep = useCallback(
    (name: StepName, update: Partial<StepState>) => {
      setSteps((prev) =>
        prev.map((s) => (s.name === name ? { ...s, ...update } : s)),
      );
    },
    [],
  );

  const generate = useCallback(
    async (
      file: File,
      articleType: ArticleType,
      tone?: string,
      style?: string,
      wordCount?: string,
      audience?: string,
    ) => {
      // Abort any previous run
      abortRef.current?.abort();

      // Reset state
      setSteps(initialSteps());
      setArticle(null);
      setError(null);
      setTotalDuration(null);
      setStreamingOutput(initialStreamingOutput());
      setIsRunning(true);

      abortRef.current = new AbortController();

      const formData = new FormData();
      formData.append("csv", file);
      formData.append("articleType", articleType);
      if (tone) formData.append("tone", tone);
      if (style) formData.append("style", style);
      if (wordCount) formData.append("wordCount", wordCount);
      if (audience) formData.append("audience", audience);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          body: formData,
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          // Split on double newline (SSE frame boundary)
          const frames = buffer.split("\n\n");
          buffer = frames.pop() || "";

          for (const frame of frames) {
            const events = parseSSEEvents(frame);
            for (const event of events) {
              switch (event.type) {
                case "step-start":
                  updateStep(event.step, { status: "running" });
                  break;
                case "step-delta":
                  setStreamingOutput((prev) => ({
                    ...prev,
                    [event.step]: prev[event.step] + event.delta,
                  }));
                  break;
                case "step-complete":
                  updateStep(event.step, {
                    status: "done",
                    output: event.output,
                    duration: event.duration,
                  });
                  // Clear streaming output for this step (final output lives in step.output)
                  setStreamingOutput((prev) => ({
                    ...prev,
                    [event.step]: "",
                  }));
                  break;
                case "step-error":
                  updateStep(event.step, {
                    status: "error",
                    error: event.error,
                  });
                  break;
                case "pipeline-complete":
                  setArticle(event.article);
                  setTotalDuration(event.totalDuration);
                  break;
                case "pipeline-error":
                  setError(event.error);
                  break;
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // Transition any running steps to error on cancel
          setSteps((prev) =>
            prev.map((s) =>
              s.status === "running"
                ? { ...s, status: "error", error: "Cancelled" }
                : s,
            ),
          );
        } else {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        setIsRunning(false);
        abortRef.current = null;
      }
    },
    [updateStep],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setSteps(initialSteps());
    setArticle(null);
    setError(null);
    setTotalDuration(null);
    setStreamingOutput(initialStreamingOutput());
    setIsRunning(false);
  }, []);

  return { steps, article, isRunning, error, totalDuration, streamingOutput, generate, cancel, reset };
}
