import type { ArticleType } from "./steps/types";

export function clusterPrompt(keywords: string[]): string {
  return `You are a keyword clustering expert. Group the following keywords into topically related clusters. Each cluster should have a descriptive name and the keywords that belong to it.

Keywords:
${keywords.join(", ")}

Output format — use exactly this structure:

## Cluster: [Cluster Name]
- keyword 1
- keyword 2
- keyword 3

## Cluster: [Cluster Name]
- keyword 4
- keyword 5

Group all keywords into clusters. Every keyword must appear in exactly one cluster. Aim for 3-7 clusters depending on the number and diversity of keywords. Do not add any extra commentary.`;
}

export function outlinePrompt(
  clusters: string,
  articleType: ArticleType,
  tone?: string,
  style?: string,
  wordCount?: string,
  audience?: string,
): string {
  const toneStr = tone ? `\nTone: ${tone}` : "";
  const styleStr = style ? `\nStyle: ${style}` : "";
  const audienceStr = audience ? `\nTarget audience: ${audience}` : "";
  const scopeHint = wordCount
    ? `\nTarget length: ~${wordCount} words — scale the number of sections accordingly`
    : "";

  return `You are an expert content strategist. Create a detailed article outline from these keyword clusters.

Article type: ${articleType}${toneStr}${styleStr}${audienceStr}${scopeHint}

Keyword clusters:
${clusters}

Create a comprehensive outline with:
- A compelling title that naturally incorporates the primary keyword theme
- An introduction section
- 4-8 main sections (H2), each with 2-4 subsections (H3)
- A conclusion section
- For each section, include a brief note on what to cover and which keywords to target

Output the outline in markdown format with H2/H3 headings. Include keyword targets in [brackets] after each section heading.`;
}

export function draftPrompt(
  outline: string,
  articleType: ArticleType,
  tone?: string,
  style?: string,
  wordCount?: string,
  audience?: string,
): string {
  const toneStr = tone ? `\nTone: ${tone}` : "";
  const styleStr = style ? `\nStyle: ${style}` : "";
  const audienceStr = audience ? `\nTarget audience: ${audience}` : "";
  const lengthGuide = wordCount ? `approximately ${wordCount}` : "1500-3000";

  return `You are an expert content writer. Write a complete first draft based on the following outline.

Article type: ${articleType}${toneStr}${styleStr}${audienceStr}

Outline:
${outline}

Write the full article following these guidelines:
- Follow the outline structure exactly
- Write ${lengthGuide} words
- Use clear, engaging prose
- Include the targeted keywords naturally
- Use markdown formatting (headings, bold, lists where appropriate)
- Write a compelling introduction and strong conclusion
- Do NOT include meta-commentary about the article itself`;
}

export function refinePrompt(draft: string): string {
  return `You are a senior editor. Refine and improve the following article draft.

Draft:
${draft}

Your refinement tasks:
1. Improve sentence flow and readability
2. Strengthen transitions between sections
3. Remove redundancy and filler content
4. Ensure consistent tone throughout
5. Improve word choice for clarity and impact
6. Fix any factual inconsistencies
7. Tighten the introduction and conclusion
8. Ensure proper markdown formatting is maintained

Output the complete refined article. Keep the same structure and headings. Do NOT add commentary or notes about your changes.`;
}

export function polishPrompt(refined: string): string {
  return `You are a world-class editor performing a final polish pass on an article.

Article:
${refined}

Final polish tasks:
1. Perfect grammar, punctuation, and spelling
2. Ensure every sentence earns its place — cut any remaining fluff
3. Sharpen the headline and subheadings for maximum clarity and engagement
4. Verify the opening hook is compelling
5. Ensure the conclusion provides clear value / next steps
6. Check that formatting (markdown headings, lists, bold) is clean and consistent
7. Ensure natural keyword integration without stuffing

Output ONLY the final polished article in clean markdown. No commentary.`;
}
