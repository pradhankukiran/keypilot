"use client";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  return (
    <details open={defaultOpen || undefined} className="group">
      <summary className="cursor-pointer select-none list-none flex items-center gap-2 py-2 text-sm font-medium text-cream-500 hover:text-cream-800 dark:text-cream-400 dark:hover:text-cream-200 transition-colors">
        <svg
          className="h-4 w-4 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
        {title}
      </summary>
      <div className="pl-6 pb-2">{children}</div>
    </details>
  );
}
