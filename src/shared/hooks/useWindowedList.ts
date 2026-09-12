import { useCallback, useEffect, useRef, useState } from "react";

import {
  DIRECTORY_LOAD_MORE_DELAY_MS,
  DIRECTORY_PAGE_SIZE,
} from "@/shared/constants/directoryPagination";

type UseWindowedListOptions = {
  /** Total rows available (usually `Children.count` / filtered length). */
  total: number;
  /** When this changes (filters, reload), visible window resets to the first page. */
  resetKey: string;
  pageSize?: number;
  enabled?: boolean;
};

/**
 * Client-side Instagram-style windowing: data is already loaded; only the first
 * `pageSize` rows render, then `loadMore` reveals the next chunk.
 */
export function useWindowedList({
  total,
  resetKey,
  pageSize = DIRECTORY_PAGE_SIZE,
  enabled = true,
}: UseWindowedListOptions) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const resetKeyRef = useRef(resetKey);

  useEffect(() => {
    resetKeyRef.current = resetKey;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync window to new list identity
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
  }, [resetKey, pageSize]);

  const effectiveVisible = enabled ? Math.min(visibleCount, total) : total;
  const hasMore = enabled && effectiveVisible < total;

  const loadMore = useCallback(() => {
    if (!enabled || !hasMore || isLoadingMore) return;

    const keyAtStart = resetKeyRef.current;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      if (resetKeyRef.current !== keyAtStart) {
        setIsLoadingMore(false);
        return;
      }
      setVisibleCount((current) => Math.min(current + pageSize, total));
      setIsLoadingMore(false);
    }, DIRECTORY_LOAD_MORE_DELAY_MS);
  }, [enabled, hasMore, isLoadingMore, pageSize, total]);

  return {
    visibleCount: effectiveVisible,
    hasMore,
    isLoadingMore,
    loadMore,
  };
}
