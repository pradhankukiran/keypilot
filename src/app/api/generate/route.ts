import { parseCSV } from "@/lib/csv-parser";
import { runPipeline } from "@/lib/pipeline";
import { createSSEResponse } from "@/lib/stream-utils";
import { ARTICLE_TYPES, type ArticleType, type PipelineInput } from "@/lib/steps/types";

export const maxDuration = 300;

const VALID_ARTICLE_TYPES = new Set<string>(ARTICLE_TYPES.map((t) => t.value));

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("csv");
    const articleType = formData.get("articleType") as string | null;
    const tone = (formData.get("tone") as string) || undefined;
    const style = (formData.get("style") as string) || undefined;
    const wordCount = (formData.get("wordCount") as string) || undefined;
    const audience = (formData.get("audience") as string) || undefined;

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "CSV file is required" }, { status: 400 });
    }
    if (!articleType || !VALID_ARTICLE_TYPES.has(articleType)) {
      return Response.json(
        { error: "Valid article type is required" },
        { status: 400 },
      );
    }

    const text = await file.text();
    const keywords = parseCSV(text);

    if (keywords.length === 0) {
      return Response.json(
        { error: "No keywords found in CSV" },
        { status: 400 },
      );
    }

    if (keywords.length > 500) {
      return Response.json(
        { error: "Too many keywords (max 500)" },
        { status: 400 },
      );
    }

    const { readable, writable } = new TransformStream<Uint8Array>();
    const writer = writable.getWriter();

    // Run pipeline in background — don't await
    runPipeline(
      { keywords, articleType: articleType as ArticleType, tone, style, wordCount: wordCount as PipelineInput["wordCount"], audience },
      writer,
    ).catch(() => {
      // Prevent unhandled rejection on client disconnect
    });

    return createSSEResponse(readable);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
