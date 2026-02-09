import Papa from "papaparse";

export function parseCSV(text: string): string[] {
  const result = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: true,
  });

  const keywords = result.data
    .flat()
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  // Deduplicate (case-insensitive), preserving first occurrence
  const seen = new Set<string>();
  return keywords.filter((k) => {
    const lower = k.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}
