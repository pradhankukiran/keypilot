export type StepName =
  | "cluster"
  | "outline"
  | "draft"
  | "refine"
  | "polish";

export const STEP_ORDER: StepName[] = [
  "cluster",
  "outline",
  "draft",
  "refine",
  "polish",
];

export const STEP_LABELS: Record<StepName, string> = {
  cluster: "Keywords → Clusters",
  outline: "Clusters → Outline",
  draft: "Outline → Initial Draft",
  refine: "Draft → Refined Draft",
  polish: "Refined → Final Article",
};

export type ArticleType =
  | "how-to-guide"
  | "listicle"
  | "comparison"
  | "ultimate-guide"
  | "product-roundup";

export const ARTICLE_TYPES: { value: ArticleType; label: string }[] = [
  { value: "how-to-guide", label: "How-To Guide" },
  { value: "listicle", label: "Listicle" },
  { value: "comparison", label: "Comparison" },
  { value: "ultimate-guide", label: "Ultimate Guide" },
  { value: "product-roundup", label: "Product Roundup" },
];

export type StepStatus = "pending" | "running" | "done" | "error";

export interface StepState {
  name: StepName;
  label: string;
  status: StepStatus;
  output?: string;
  duration?: number;
  error?: string;
}

export type PipelineEvent =
  | { type: "step-start"; step: StepName }
  | { type: "step-delta"; step: StepName; delta: string }
  | { type: "step-complete"; step: StepName; output: string; duration: number }
  | { type: "step-error"; step: StepName; error: string }
  | {
      type: "pipeline-complete";
      article: string;
      totalDuration: number;
    }
  | { type: "pipeline-error"; error: string };

export type WordCount = "500" | "1000" | "1500" | "2500" | "4000";

export const WORD_COUNTS: { value: WordCount; label: string }[] = [
  { value: "500", label: "~500 (Short)" },
  { value: "1000", label: "~1,000 (Medium)" },
  { value: "1500", label: "~1,500 (Standard)" },
  { value: "2500", label: "~2,500 (Long)" },
  { value: "4000", label: "~4,000 (In-depth)" },
];

export interface PipelineInput {
  keywords: string[];
  articleType: ArticleType;
  tone?: string;
  style?: string;
  wordCount?: WordCount;
  audience?: string;
}
