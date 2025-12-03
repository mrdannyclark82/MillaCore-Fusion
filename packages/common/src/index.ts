export function normalizeString(s: string): string {
  return (s || "").trim().toLowerCase();
}

export function safeJsonParse<T = any>(input: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}
