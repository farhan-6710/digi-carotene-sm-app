import { Link, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";

import { ReportStatusFilters } from "@/features/reports/components/ReportStatusFilters";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import {
  encodeClientReportId,
  formatPostedOn,
  formatReportTableDate,
} from "@/features/reports/utils/reportsUtils";
import { buildClientReportPath } from "@/features/reports/utils/reportsUrlParams";
import type { ReportsTableProps } from "@/features/reports/types/components";

export function ReportsTable({
  summaries,
  isLoading,
  hasGenerated,
  periodLabel,
  statusFilterOptions,
  activeStatuses,
  onToggleStatusFilter,
}: ReportsTableProps) {
  const [searchParams] = useSearchParams();

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
        <div>
          <div className="text-sm font-semibold">Client activity report</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasGenerated
              ? `Posts scheduled between ${periodLabel}, sorted by most posted clients first.`
              : "Select a date range above to view client posts."}
          </p>
        </div>

        <ReportStatusFilters
          options={statusFilterOptions}
          activeStatuses={activeStatuses}
          onToggle={onToggleStatusFilter}
        />
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.7fr_0.8fr_1fr] gap-4 bg-muted px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground max-lg:hidden">
          <div>CLIENT</div>
          <div>SCHEDULED DATE</div>
          <div>TIME</div>
          <div>STATUS</div>
          <div>POSTED ON</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center px-6 py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : !hasGenerated ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Select a date range above to populate this table.
          </div>
        ) : summaries.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No client posts found for the selected range and filters.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {summaries.map((summary) => (
              <div key={summary.clientName}>
                <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-6 py-3">
                  <Link
                    to={buildClientReportPath(
                      encodeClientReportId(summary.clientName),
                      searchParams,
                    )}
                    className="text-sm font-semibold text-foreground transition hover:text-primary"
                  >
                    {summary.clientName}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{summary.totalPosts} posts</span>
                    <span>{summary.postedCount} posted</span>
                    <span>{summary.scheduledCount} scheduled</span>
                    <span>{summary.notPostedCount} not posted</span>
                  </div>
                </div>

                {summary.posts.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-3 px-6 py-4 max-lg:space-y-2 lg:grid-cols-[1.2fr_0.9fr_0.7fr_0.8fr_1fr] lg:items-center lg:gap-4"
                  >
                    <div className="text-sm text-muted-foreground max-lg:hidden">
                      {summary.clientName}
                    </div>

                    <div className="text-sm text-foreground max-lg:text-xs">
                      <span className="font-semibold tracking-wider text-muted-foreground lg:hidden">
                        DATE{" "}
                      </span>
                      {formatReportTableDate(row.scheduledDate)}
                    </div>

                    <div className="font-mono text-sm text-muted-foreground max-lg:text-xs">
                      <span className="font-semibold tracking-wider text-muted-foreground lg:hidden">
                        TIME{" "}
                      </span>
                      {row.scheduledTime}
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${statusText[row.status]}`}
                      >
                        <span
                          className={`size-2 rounded-full ${statusColors[row.status]}`}
                        />
                        {row.status}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground max-lg:text-xs">
                      <span className="font-semibold tracking-wider text-muted-foreground lg:hidden">
                        POSTED ON{" "}
                      </span>
                      {formatPostedOn(row.postedDate, row.postedTime)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
