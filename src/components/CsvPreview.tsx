"use client";

export function CsvPreview({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) return null;

  return (
    <div className="rounded-xl border border-cream-200 dark:border-cream-800 bg-card p-4">
      <p className="text-xs font-semibold text-cream-500 dark:text-cream-400 uppercase tracking-wider mb-2">
        {keywords.length} keyword{keywords.length !== 1 ? "s" : ""} loaded
      </p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="inline-block rounded-md bg-accent-500/10 dark:bg-accent-400/10 px-2 py-0.5 text-xs text-accent-600 dark:text-accent-400"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
