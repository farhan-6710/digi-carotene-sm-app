import { Link, useSearchParams } from "react-router";

import { PostStatusFilter } from "@/shared/ui/PostStatusFilter";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import {
  REPORTS_DIRECTORY_ROW_GRID_CLASS,
  reportsDirectoryConfig,
} from "@/features/reports/constants/reportsDirectory";
import {
  encodeClientReportId,
  formatPostedOn,
  formatReportTableDate,
} from "@/features/reports/utils/reportsUtils";
import { buildClientReportPath } from "@/features/reports/utils/reportsUrlParams";
import type { ReportsTableProps } from "@/features/reports/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

export function ReportsTable({
  summaries,
  isLoading,
  hasGenerated,
  periodLabel,
  statusFilterOptions,
  showAll,
  activeStatuses,
  onToggleStatusFilter,
}: ReportsTableProps) {
  const [searchParams] = useSearchParams();

  return (
    <DirectoryTable
      title={reportsDirectoryConfig.title}
      description={
        hasGenerated
          ? `Posts with to-be-posted dates between ${periodLabel}, sorted by most posted clients first.`
          : "Select a date range above to view client posts."
      }
      gridClass={reportsDirectoryConfig.gridClass}
      columns={[...reportsDirectoryConfig.columns]}
      emptyMessage={
        !hasGenerated
          ? "Select a date range above to populate this table."
          : "No client posts found for the selected range and filters."
      }
      isLoading={isLoading}
      isEmpty={!hasGenerated || summaries.length === 0}
      headerAside={
        <PostStatusFilter
          options={statusFilterOptions}
          showAll={showAll}
          activeStatuses={activeStatuses}
          onToggle={onToggleStatusFilter}
        />
      }
    >
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
              className={cn(
                "grid gap-3 px-6 py-4 max-lg:space-y-2 lg:items-center lg:gap-4",
                REPORTS_DIRECTORY_ROW_GRID_CLASS,
              )}
            >
              <div className="text-sm text-muted-foreground max-lg:hidden">
                {summary.clientName}
              </div>

              <div className="text-sm text-foreground max-lg:text-xs">
                <span className="font-semibold tracking-wider text-muted-foreground lg:hidden">
                  DATE{" "}
                </span>
                {formatReportTableDate(row.toBePostedDate)}
              </div>

              <div className="font-mono text-sm text-muted-foreground max-lg:text-xs">
                <span className="font-semibold tracking-wider text-muted-foreground lg:hidden">
                  TIME{" "}
                </span>
                {row.toBePostedTime}
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
    </DirectoryTable>
  );
}
