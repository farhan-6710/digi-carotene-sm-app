import { useCallback, useMemo, useState } from "react";

/**
 * Multi-select for DirectoryTable lists.
 * `allVisibleIds` = filtered list ids currently shown on the page.
 * Drops selected ids that leave the visible set (e.g. after filter/delete).
 */
export function useDirectoryBulkSelection(allVisibleIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleSet = useMemo(
    () => new Set(allVisibleIds.filter(Boolean)),
    [allVisibleIds],
  );

  const visibleSelectedIds = useMemo(
    () => selectedIds.filter((id) => visibleSet.has(id)),
    [selectedIds, visibleSet],
  );

  const selectedCount = visibleSelectedIds.length;

  const isSelected = useCallback(
    (id: string) => visibleSelectedIds.includes(id),
    [visibleSelectedIds],
  );

  const toggle = useCallback((id: string) => {
    if (!id) return;
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((row) => row !== id)
        : [...current, id],
    );
  }, []);

  const allVisibleSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => visibleSelectedIds.includes(id));

  const toggleAllVisible = useCallback(() => {
    setSelectedIds((current) => {
      const everySelected =
        allVisibleIds.length > 0 &&
        allVisibleIds.every((id) => current.includes(id));
      return everySelected ? [] : [...allVisibleIds];
    });
  }, [allVisibleIds]);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds: visibleSelectedIds,
    selectedCount,
    isSelected,
    toggle,
    toggleAllVisible,
    clear,
    allVisibleSelected,
  };
}
