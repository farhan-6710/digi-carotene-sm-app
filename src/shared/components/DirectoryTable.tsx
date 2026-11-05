import {
  Children,
  isValidElement,
  useMemo,
} from "react";

import { cn } from "@/shared/lib/utils";
import { DirectoryPagination } from "@/shared/components/DirectoryPagination";
import { DirectoryTableHeaderCell } from "@/shared/components/DirectoryTableHeaderCell";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";
import {
  DIRECTORY_TABLE_MIN_WIDTH_CLASS,
  DIRECTORY_TABLE_SCROLL_TRACK_CLASS,
  DIRECTORY_TABLE_TRACK_ALIGN_CLASS,
  TABLE_HORIZONTAL_SCROLL_CLASS,
} from "@/shared/constants/directoryTable";
import { useDirectoryPagination } from "@/shared/hooks/useDirectoryPagination";
import type { DirectoryTableProps } from "@/shared/types/components";
import { TooltipProvider } from "@/shared/ui/tooltip";

/**
 * Shared directory listing table.
 * Track align class keeps header + body column widths in sync when cell
 * content length differs (default grid min-width:auto otherwise blows tracks).
 *
 * By default rows are paginated (30 per page): full lists still load in the
 * page/hook, but only the current page renders with shadcn Pagination.
 *
 * Optional: `contentMinWidthPx` for wide/scrollable columns; `onColumnMove`
 * + `column.reorderable` for accessible column reorder menu.
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
  paginated = true,
  contentMinWidthPx,
  onColumnMove,
}: DirectoryTableProps) {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  const resetKey = useMemo(
    () =>
      childArray
        .map((child) => (isValidElement(child) ? String(child.key ?? "") : ""))
        .join("\0"),
    [childArray],
  );

  const paginationEnabled = paginated && !isLoading && !isEmpty;
  const { page, pageCount, setPage, start, end, showPagination } =
    useDirectoryPagination({
      total: childArray.length,
      resetKey,
      enabled: paginationEnabled,
    });

  const visibleChildren = paginationEnabled
    ? childArray.slice(start, end)
    : childArray;

  const reorderableIds = useMemo(
    () =>
      columns
        .filter((column) => column.reorderable && column.id)
        .map((column) => column.id as string),
    [columns],
  );

  const truncateHeaders = Boolean(contentMinWidthPx);

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
          contentMinWidthPx
            ? DIRECTORY_TABLE_SCROLL_TRACK_CLASS
            : DIRECTORY_TABLE_TRACK_ALIGN_CLASS,
        )}
      >
        <div
          className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}
          style={
            contentMinWidthPx
              ? { minWidth: Math.max(contentMinWidthPx, 44 * 16) }
              : undefined
          }
        >
          <TooltipProvider delayDuration={300}>
            <div
              className={cn(
                "grid text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden bg-muted px-6 border-b border-border",
                contentMinWidthPx ? "min-w-full" : "w-full",
                divided
                  ? "items-stretch divide-x divide-border"
                  : "gap-4 py-3",
                gridClass,
              )}
              style={gridStyle}
            >
              {columns.map((column, index) => {
                const canReorder =
                  Boolean(onColumnMove) &&
                  Boolean(column.reorderable) &&
                  Boolean(column.id);
                const reorderIndex = column.id
                  ? reorderableIds.indexOf(column.id)
                  : -1;

                return (
                  <DirectoryTableHeaderCell
                    key={column.id ?? `${column.label}-${index}`}
                    column={column}
                    index={index}
                    divided={divided}
                    truncate={truncateHeaders}
                    canReorder={canReorder}
                    canMoveLeft={reorderIndex > 0}
                    canMoveRight={
                      reorderIndex >= 0 &&
                      reorderIndex < reorderableIds.length - 1
                    }
                    onMove={
                      canReorder && column.id && onColumnMove
                        ? (direction) =>
                            onColumnMove(column.id as string, direction)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </TooltipProvider>

          {isLoading ? (
            <TableLoadingState />
          ) : isEmpty ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="divide-y divide-border">{visibleChildren}</div>
          )}
        </div>
      </div>

      {showPagination ? (
        <div className="border-t border-border px-6 py-3">
          <DirectoryPagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
