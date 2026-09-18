import { useCallback, useMemo, useState } from "react";

import {
  mergeColumnPreference,
  moveColumnId,
  readColumnPreference,
  writeColumnPreference,
} from "@/shared/utils/columnPreferenceStorage";

/**
 * Column visibility + order with localStorage persistence.
 * `allowedIds` filters stale ids when options change (e.g. Google campaign type).
 */
export function usePersistedColumnIds(
  storageKey: string,
  defaults: readonly string[],
  allowedIds: ReadonlySet<string>,
) {
  const [columnIds, setColumnIdsState] = useState<string[]>(() =>
    mergeColumnPreference(
      readColumnPreference(storageKey),
      defaults,
      allowedIds,
    ),
  );

  const resolvedIds = useMemo(
    () => mergeColumnPreference(columnIds, defaults, allowedIds),
    [allowedIds, columnIds, defaults],
  );

  const setColumnIds = useCallback(
    (next: string[] | ((prev: string[]) => string[])) => {
      setColumnIdsState((prev) => {
        const current = mergeColumnPreference(prev, defaults, allowedIds);
        const value = typeof next === "function" ? next(current) : next;
        const merged = mergeColumnPreference(value, defaults, allowedIds);
        writeColumnPreference(storageKey, merged);
        return merged;
      });
    },
    [allowedIds, defaults, storageKey],
  );

  const moveColumn = useCallback(
    (columnId: string, direction: "left" | "right") => {
      setColumnIds((prev) => moveColumnId(prev, columnId, direction));
    },
    [setColumnIds],
  );

  return {
    columnIds: resolvedIds,
    setColumnIds,
    moveColumn,
  };
}
