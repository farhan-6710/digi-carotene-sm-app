import { cn } from "@/shared/lib/utils";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";
import { DIRECTORY_TABLE_MIN_WIDTH_CLASS, TABLE_HORIZONTAL_SCROLL_CLASS } from "@/shared/constants/directoryTable";
import type { DirectoryTableProps } from "@/shared/types/components";

export function DirectoryTable({
  title,
  description,
  gridClass,
  columns,
  isLoading,
  isEmpty,
  emptyMessage,
  headerAside,
  children,
  divided = false,
  gridStyle,
}: DirectoryTableProps) {
  return (
    <div className="w-full min-w-0 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {headerAside ? <div className="shrink-0">{headerAside}</div> : null}
      </div>

      <div className={cn(TABLE_HORIZONTAL_SCROLL_CLASS, "border-t border-border")}>
        <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
          <div
            className={cn(
              "grid text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden bg-muted px-6",
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
                  column.align === "right" ? "text-right" : undefined,
                  divided
                    ? cn("py-3 pr-4 relative", index === 0 ? "pl-0" : "pl-4")
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
            <div className="divide-y divide-border">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
