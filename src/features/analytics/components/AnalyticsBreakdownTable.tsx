import {
  ANALYTICS_BREAKDOWN_GRID_CLASS,
  buildAnalyticsBreakdownColumns,
} from "@/features/analytics/constants/analyticsBreakdownTable";
import type { AnalyticsBreakdownTableProps } from "@/features/analytics/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

export function AnalyticsBreakdownTable({
  title,
  rows,
  isLoading = false,
  emptyMessage = "No data available yet.",
  nameHeader = "Name",
}: AnalyticsBreakdownTableProps) {
  return (
    <DirectoryTable
      title={title}
      description="Post volume by status for the selected period."
      gridClass={ANALYTICS_BREAKDOWN_GRID_CLASS}
      columns={buildAnalyticsBreakdownColumns(nameHeader)}
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      isEmpty={rows.length === 0}
    >
      {rows.map((row, index) => (
        <div
          key={row.id}
          className={cn(
            "grid items-center gap-4 px-6 py-3.5",
            ANALYTICS_BREAKDOWN_GRID_CLASS,
            index === 0 && "bg-primary/5",
          )}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="block truncate">{row.name}</span>
              {row.meta ? (
                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {row.meta}
                </span>
              ) : null}
            </span>
          </div>
          <div className="text-right font-mono text-sm font-semibold text-foreground">
            {row.total}
          </div>
          <div className="text-right font-mono text-sm text-status-posted">
            {row.posted}
          </div>
          <div className="text-right font-mono text-sm text-status-scheduled">
            {row.scheduled}
          </div>
          <div className="text-right font-mono text-sm text-status-not-posted">
            {row.notPosted}
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
