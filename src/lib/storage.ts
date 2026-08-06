// Defensive localStorage reads.
//
// Every value the app stores is JSON it wrote itself — but the store can be
// corrupted (hand-edited, truncated by quota eviction, written by an older
// build with a different shape). `JSON.parse` throws on the first case and
// happily returns a wrong-typed value on the second; both used to crash
// consumers downstream. These helpers contain both failure modes.

/**
 * Reads and JSON-parses a localStorage key. Returns `fallback` when the key
 * is missing, the value fails to parse, or `validate` rejects the parsed
 * shape. Never throws. SSR-safe (returns `fallback` when no window).
 */
export function readStorage<T>(
    key: string,
    fallback: T,
    validate?: (value: unknown) => value is T
): T {
    if (typeof window === 'undefined') return fallback;
    let raw: string | null;
    try {
        raw = window.localStorage.getItem(key);
    } catch {
        // Storage can throw in private-mode / disabled-cookie contexts.
        return fallback;
    }
    if (raw === null) return fallback;
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return fallback;
    }
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
}

/** Type guard: value is an array. */
export const isArray = (v: unknown): v is unknown[] => Array.isArray(v);
