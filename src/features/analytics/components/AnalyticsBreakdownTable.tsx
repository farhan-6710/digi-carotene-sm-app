import { Loader2 } from "lucide-react";

import type { AnalyticsBreakdownTableProps } from "@/features/analytics/types/components";

const GRID = "grid grid-cols-[1.6fr_0.6fr_0.7fr_0.7fr_0.8fr] gap-4";

export function AnalyticsBreakdownTable({
  title,
  rows,
  isLoading = false,
  emptyMessage = "No data available yet.",
  nameHeader = "Name",
}: AnalyticsBreakdownTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="text-sm font-semibold text-foreground">{title}</div>
      </div>

      <div>
        <div
          className={`${GRID} bg-muted/50 px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground`}
        >
          <div>{nameHeader.toUpperCase()}</div>
          <div className="text-right">TOTAL</div>
          <div className="text-right">POSTED</div>
          <div className="text-right">SCHEDULED</div>
          <div className="text-right">NOT POSTED</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center border-t border-border">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="divide-y divide-border border-t">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className={`${GRID} items-center px-6 py-3.5 ${index === 0 ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span
                    className={[
                      "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
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
          </div>
        )}
      </div>
    </div>
  );
}
