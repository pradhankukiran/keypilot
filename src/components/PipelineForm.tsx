"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { ARTICLE_TYPES, WORD_COUNTS, type ArticleType, type WordCount } from "@/lib/steps/types";
import { parseCSV } from "@/lib/csv-parser";
import { CsvPreview } from "./CsvPreview";

interface PipelineFormProps {
  onSubmit: (
    file: File,
    articleType: ArticleType,
    tone?: string,
    style?: string,
    wordCount?: string,
    audience?: string,
  ) => void;
  isRunning: boolean;
  onCancel: () => void;
}

export function PipelineForm({
  onSubmit,
  isRunning,
  onCancel,
}: PipelineFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [articleType, setArticleType] = useState<ArticleType>("how-to-guide");
  const [tone, setTone] = useState("");
  const [style, setStyle] = useState("");
  const [wordCount, setWordCount] = useState<WordCount>("1500");
  const [audience, setAudience] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File | null) {
    if (!f) {
      setFile(null);
      setKeywords([]);
      return;
    }
    setFile(f);
    const text = await f.text();
    setKeywords(parseCSV(text));
  }

  function openFilePicker() {
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.click();
    }
  }

  function handleDropZoneKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || isRunning) return;
    onSubmit(file, articleType, tone || undefined, style || undefined, wordCount, audience || undefined);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CSV Upload */}
      <div>
        <label
          htmlFor="csv-upload"
          className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1"
        >
          Keywords CSV
        </label>
        <div
          role="button"
          tabIndex={0}
          className={`relative rounded-xl border-2 border-dashed transition-colors p-6 text-center cursor-pointer ${
            isDragging
              ? "border-accent-500"
              : "border-cream-300 dark:border-cream-700 hover:border-cream-400 dark:hover:border-cream-600"
          }`}
          onClick={openFilePicker}
          onKeyDown={handleDropZoneKey}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <input
            ref={fileRef}
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <p className="text-sm text-cream-600 dark:text-cream-400">
              <span className="font-medium text-cream-800 dark:text-cream-200">
                {file.name}
              </span>{" "}
              — {keywords.length} keywords
            </p>
          ) : (
            <p className="text-sm text-cream-500">
              Drop a CSV file here, or click to browse
            </p>
          )}
        </div>
      </div>

      <CsvPreview keywords={keywords} />

      {/* Article Type & Word Count */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="article-type"
            className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1"
          >
            Article Type
          </label>
          <select
            id="article-type"
            value={articleType}
            onChange={(e) => setArticleType(e.target.value as ArticleType)}
            className="w-full rounded-lg border border-cream-300 dark:border-cream-700 bg-card px-3 py-2 text-sm text-cream-800 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {ARTICLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="word-count"
            className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1"
          >
            Target Length
          </label>
          <select
            id="word-count"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value as WordCount)}
            className="w-full rounded-lg border border-cream-300 dark:border-cream-700 bg-card px-3 py-2 text-sm text-cream-800 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {WORD_COUNTS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tone & Style */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="tone-input"
            className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1"
          >
            Tone{" "}
            <span className="text-cream-400 font-normal">(optional)</span>
          </label>
          <input
            id="tone-input"
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            maxLength={100}
            placeholder="e.g. professional, casual"
            className="w-full rounded-lg border border-cream-300 dark:border-cream-700 bg-card px-3 py-2 text-sm text-cream-800 dark:text-cream-200 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <div>
          <label
            htmlFor="style-input"
            className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1"
          >
            Style{" "}
            <span className="text-cream-400 font-normal">(optional)</span>
          </label>
          <input
            id="style-input"
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            maxLength={100}
            placeholder="e.g. data-driven, narrative"
            className="w-full rounded-lg border border-cream-300 dark:border-cream-700 bg-card px-3 py-2 text-sm text-cream-800 dark:text-cream-200 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label
          htmlFor="audience-input"
          className="block text-sm font-medium text-cream-700 dark:text-cream-300 mb-1"
        >
          Target Audience{" "}
          <span className="text-cream-400 font-normal">(optional)</span>
        </label>
        <input
          id="audience-input"
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          maxLength={150}
          placeholder="e.g. small business owners, beginner developers"
          className="w-full rounded-lg border border-cream-300 dark:border-cream-700 bg-card px-3 py-2 text-sm text-cream-800 dark:text-cream-200 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!file || keywords.length === 0 || isRunning}
          className="flex-1 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? "Generating..." : "Generate Article"}
        </button>
        {isRunning && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-cream-300 dark:border-cream-700 px-4 py-2.5 text-sm font-medium text-cream-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-cream-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
