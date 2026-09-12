import {
  Children,
  isValidElement,
  useMemo,
} from "react";

import { cn } from "@/shared/lib/utils";
import { LoadingSpinner, TableLoadingState } from "@/shared/components/LoadingSpinner";
import {
  DIRECTORY_TABLE_MIN_WIDTH_CLASS,
  DIRECTORY_TABLE_TRACK_ALIGN_CLASS,
  TABLE_HORIZONTAL_SCROLL_CLASS,
} from "@/shared/constants/directoryTable";
import { useLoadMoreSentinel } from "@/shared/hooks/useLoadMoreSentinel";
import { useWindowedList } from "@/shared/hooks/useWindowedList";
import type { DirectoryTableProps } from "@/shared/types/components";

/**
 * Shared directory listing table.
 * Track align class keeps header + body column widths in sync when cell
 * content length differs (default grid min-width:auto otherwise blows tracks).
 *
 * By default rows are windowed (30 at a time): full lists still load in the
 * page/hook, but only a chunk renders until the user scrolls to the bottom.
 */
export function DirectoryTable({
  title,
  description,
  gridClass,
  columns,
  isLoading,
  isEmpty,
  emptyMessage,
  headerAside,
  filters,
  children,
  divided = false,
  gridStyle,
  windowed = true,
}: DirectoryTableProps) {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  const resetKey = useMemo(
    () =>
      childArray
        .map((child) => (isValidElement(child) ? String(child.key ?? "") : ""))
        .join("\0"),
    [childArray],
  );

  const windowingEnabled = windowed && !isLoading && !isEmpty;
  const { visibleCount, hasMore, isLoadingMore, loadMore } = useWindowedList({
    total: childArray.length,
    resetKey,
    enabled: windowingEnabled,
  });

  const sentinelRef = useLoadMoreSentinel({
    enabled: windowingEnabled && hasMore && !isLoadingMore,
    onLoadMore: loadMore,
  });

  const visibleChildren = windowingEnabled
    ? childArray.slice(0, visibleCount)
    : childArray;

  return (
    <div className="w-full min-w-0 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{title}</div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {headerAside ? (
          <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {headerAside}
          </div>
        ) : null}
      </div>

      {filters ? (
        <div className="border-t border-border px-6 py-3">
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {filters}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          TABLE_HORIZONTAL_SCROLL_CLASS,
          "border-t border-border",
          DIRECTORY_TABLE_TRACK_ALIGN_CLASS,
        )}
      >
        <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
          <div
            className={cn(
              "grid w-full text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden bg-muted px-6",
              divided
                ? "items-stretch divide-x divide-border border-b border-border"
                : "gap-4 py-3",
              gridClass,
            )}
            style={gridStyle}
          >
            {columns.map((column, index) => (
              <div
                key={column.label}
                className={cn(
                  "min-w-0",
                  column.align === "right" ? "text-right" : undefined,
                  divided
                    ? cn(
                        "py-3 pr-4 relative",
                        index === 0 ? "pl-0" : "pl-4",
                      )
                    : undefined,
                )}
              >
                {column.label}
              </div>
            ))}
          </div>

          {isLoading ? (
            <TableLoadingState />
          ) : isEmpty ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">{visibleChildren}</div>

              {windowingEnabled && (hasMore || isLoadingMore) ? (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center gap-2 px-6 py-4"
                  aria-hidden={!isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="text-xs text-muted-foreground">
                        Loading more…
                      </span>
                    </>
                  ) : (
                    <span className="h-4" />
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
