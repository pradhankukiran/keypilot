"use client";

import { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function ArticleOutput({
  article,
  totalDuration,
  isStreaming,
}: {
  article: string;
  totalDuration: number | null;
  isStreaming: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(article);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (non-HTTPS or permission denied)
    }
  }

  function exportMarkdown() {
    const blob = new Blob([article], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "article.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-cream-600 dark:text-cream-400 uppercase tracking-wider">
            Final Article
          </h2>
          {totalDuration != null && (
            <span className="text-xs text-cream-400 dark:text-cream-500">
              Generated in {formatDuration(totalDuration)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            disabled={isStreaming}
            className="rounded-md border border-cream-300 dark:border-cream-700 px-3 py-1.5 text-xs font-medium text-cream-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-cream-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? "Copied!" : "Copy Markdown"}
          </button>
          <button
            onClick={exportMarkdown}
            disabled={isStreaming}
            className="rounded-md border border-cream-300 dark:border-cream-700 px-3 py-1.5 text-xs font-medium text-cream-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-cream-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export .md
          </button>
        </div>
      </div>
      <MarkdownRenderer content={article} />
    </div>
  );
}
