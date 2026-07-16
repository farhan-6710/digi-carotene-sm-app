import { cn } from "@/shared/lib/utils";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";
import { DIRECTORY_TABLE_MIN_WIDTH_CLASS } from "@/shared/constants/directoryTable";
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

      <div className="max-w-full overflow-x-auto border-t border-border">
        <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
          <div
            className={cn(
              "grid gap-4 bg-muted px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden",
              gridClass,
            )}
          >
            {columns.map((column) => (
              <div
                key={column.label}
                className={column.align === "right" ? "text-right" : undefined}
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
