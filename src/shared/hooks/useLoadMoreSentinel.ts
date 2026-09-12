import { useEffect, useRef } from "react";

type UseLoadMoreSentinelOptions = {
  enabled: boolean;
  onLoadMore: () => void;
};

/** Fires `onLoadMore` when the sentinel enters the viewport (page scroll). */
export function useLoadMoreSentinel({
  enabled,
  onLoadMore,
}: UseLoadMoreSentinelOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current();
        }
      },
      { root: null, rootMargin: "120px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
