import type { PipelineEvent } from "./steps/types";

export function formatSSE(event: PipelineEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function createSSEResponse(
  readable: ReadableStream<Uint8Array>,
): Response {
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
