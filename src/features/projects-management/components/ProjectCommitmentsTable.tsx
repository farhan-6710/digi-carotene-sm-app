import type { ReactNode } from "react";
import { Link } from "react-router";

import {
  PROJECT_COMMITMENTS_GRID_CLASS,
  projectCommitmentsColumns,
  projectCommitmentsDirectoryConfig,
} from "@/features/projects-management/constants/projectCommitmentsDirectory";
import type { ProjectCommitmentRow } from "@/features/projects-management/utils/projectCommitmentsUtils";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import type { DateFiltersTwoProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

type ProjectCommitmentsTableProps = {
  rows: ProjectCommitmentRow[];
  isLoading?: boolean;
  dateFilterProps?: DateFiltersTwoProps;
  viewAllPath?: string;
  title?: string;
  description?: string;
  paginated?: boolean;
  showRank?: boolean;
  headerAsideExtra?: ReactNode;
  filters?: ReactNode;
  emptyMessage?: string;
};

function CommitmentCells({
  row,
  emphasize,
}: {
  row: ProjectCommitmentRow;
  emphasize?: boolean;
}) {
  const valueClass = cn(
    "text-right font-mono text-sm",
    emphasize ? "font-semibold text-primary" : "text-foreground",
  );

  return (
    <>
      <div className={valueClass}>{row.committedSinglePosts}</div>
      <div className={valueClass}>{row.committedCarousels}</div>
      <div className={valueClass}>{row.committedReels}</div>
      <div className={valueClass}>{row.committedStories}</div>
      <div className={valueClass}>{row.committedVideos}</div>
      <div
        className={cn(
          "text-right font-mono text-sm font-semibold",
          emphasize ? "text-primary" : "text-foreground",
        )}
      >
        {row.total}
      </div>
    </>
  );
}

export function ProjectCommitmentsTable({
  rows,
  isLoading = false,
  dateFilterProps,
  viewAllPath,
  title = projectCommitmentsDirectoryConfig.title,
  description = projectCommitmentsDirectoryConfig.description,
  paginated = true,
  showRank = true,
  headerAsideExtra,
  filters,
  emptyMessage = projectCommitmentsDirectoryConfig.emptyMessage,
}: ProjectCommitmentsTableProps) {
  return (
    <DirectoryTable
      title={title}
      description={description}
      gridClass={PROJECT_COMMITMENTS_GRID_CLASS}
      columns={projectCommitmentsColumns}
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      isEmpty={rows.length === 0}
      paginated={paginated}
      filters={filters}
      headerAside={
        <div className="flex flex-wrap items-center justify-end gap-3">
          {dateFilterProps ? <DateFiltersTwo {...dateFilterProps} /> : null}
          {headerAsideExtra}
          {viewAllPath ? (
            <Link
              to={viewAllPath}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </div>
      }
    >
      {rows.map((row, index) => (
        <DirectoryTableRow
          key={row.id}
          to={row.detailPath}
          className={cn(
            "grid items-center gap-4 px-6 py-3.5",
            PROJECT_COMMITMENTS_GRID_CLASS,
            showRank && index === 0 && "bg-primary/5",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {showRank ? (
                <span
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-2xs",
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
              ) : null}
              <span className="truncate">{row.projectName}</span>
            </div>
            {row.clientName ? (
              <p
                className={cn(
                  "mt-0.5 truncate text-xs text-muted-foreground",
                  showRank && "pl-7",
                )}
              >
                {row.clientName}
              </p>
            ) : null}
          </div>
          <CommitmentCells
            row={row}
            emphasize={showRank && index === 0}
          />
        </DirectoryTableRow>
      ))}
    </DirectoryTable>
  );
}
