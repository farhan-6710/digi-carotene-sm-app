/**
 * Persist table column visibility + order (UI chrome).
 * Same pattern as theme preference — not campaign metrics data.
 */

export function readColumnPreference(storageKey: string): string[] | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const ids = parsed.filter((item): item is string => typeof item === "string");
    return ids.length > 0 ? ids : null;
  } catch {
    return null;
  }
}

export function writeColumnPreference(storageKey: string, columnIds: string[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(columnIds));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/**
 * Keep preferred order and drop unknown ids.
 * Does not force-add defaults (user may hide columns).
 * Empty / all-invalid prefs fall back to defaults.
 */
export function mergeColumnPreference(
  preferred: string[] | null,
  defaults: readonly string[],
  allowedIds: ReadonlySet<string>,
): string[] {
  const fallback = defaults.filter((id) => allowedIds.has(id));
  if (!preferred) return fallback;

  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const id of preferred) {
    if (!allowedIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
  }

  return ordered.length > 0 ? ordered : fallback;
}

export function moveColumnId(
  columnIds: string[],
  columnId: string,
  direction: "left" | "right",
): string[] {
  const index = columnIds.indexOf(columnId);
  if (index < 0) return columnIds;
  const target = direction === "left" ? index - 1 : index + 1;
  if (target < 0 || target >= columnIds.length) return columnIds;

  const next = [...columnIds];
  const swap = next[target];
  next[target] = next[index]!;
  next[index] = swap!;
  return next;
}
