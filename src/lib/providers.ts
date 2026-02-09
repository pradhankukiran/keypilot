import { createCerebras } from "@ai-sdk/cerebras";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import type { StepName } from "./steps/types";

const cerebras = createCerebras();
const groq = createGroq();
const openrouter = createOpenRouter();

export const STEP_MODELS: Record<StepName, LanguageModel> = {
  cluster: cerebras("llama3.1-8b"),
  outline: groq("llama-3.3-70b-versatile"),
  draft: groq("llama-3.3-70b-versatile"),
  refine: cerebras("gpt-oss-120b"),
  polish: openrouter("openai/gpt-oss-120b"),
};
