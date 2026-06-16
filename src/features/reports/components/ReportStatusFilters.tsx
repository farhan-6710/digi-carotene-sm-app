import {
  statusColors,
} from "@/features/posts-management/constants/postsManagement";
import {
  reportStatusFilterActiveStyles,
  reportStatusFilterInactiveStyles,
} from "@/features/reports/constants/reports";
import { cn } from "@/shared/lib/utils";
import type { ReportStatusFiltersProps } from "@/features/reports/types/components";

export function ReportStatusFilters({
  options,
  activeStatuses,
  onToggle,
}: ReportStatusFiltersProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Filter by status
      </span>
      <div
        className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-muted/40 p-1.5"
        role="group"
        aria-label="Filter by status"
      >
        {options.map((status) => {
          const isActive = activeStatuses.includes(status);

          return (
            <button
              key={status}
              type="button"
              onClick={() => onToggle(status)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                isActive
                  ? reportStatusFilterActiveStyles[status]
                  : reportStatusFilterInactiveStyles[status],
                !isActive && "hover:bg-muted/50 hover:text-muted-foreground",
              )}
              aria-pressed={isActive}
            >
              <span
                className={cn(
                  "rounded-full transition-all",
                  isActive ? "size-2.5 " + statusColors[status] : "size-2 bg-muted-foreground/35",
                )}
              />
              <span>{status}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
