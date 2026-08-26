import { Link } from "react-router";

import {
  POSTS_TOP_CLIENTS_GRID_CLASS,
  postsTopClientsColumns,
} from "@/features/analytics/constants/postsTopClientsDirectory";
import type { PostsTopClientsTableProps } from "@/features/analytics/types/components";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

export function PostsTopClientsTable({
  clients,
  isLoading = false,
  dateFilterProps,
}: PostsTopClientsTableProps) {
  return (
    <DirectoryTable
      title="Clients With Most Posts"
      description="Top clients by post volume for the selected period."
      gridClass={POSTS_TOP_CLIENTS_GRID_CLASS}
      columns={postsTopClientsColumns}
      emptyMessage="No posts in this period yet."
      isLoading={isLoading}
      isEmpty={clients.length === 0}
      headerAside={
        <div className="flex flex-wrap items-center justify-end gap-3">
          {dateFilterProps ? <DateFiltersTwo {...dateFilterProps} /> : null}
          <Link
            to="/team-portal/posts-management"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all <span aria-hidden="true">↗</span>
          </Link>
        </div>
      }
    >
      {clients.map((client, index) => (
        <div
          key={client.name}
          className={cn(
            "grid items-center gap-4 px-6 py-3.5",
            POSTS_TOP_CLIENTS_GRID_CLASS,
            index === 0 && "bg-primary/5",
          )}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span
              className={cn(
                "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold shadow-2xs",
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {index + 1}
            </span>
            {client.name}
          </div>
          <div
            className={cn(
              "text-right font-mono text-sm",
              index === 0 ? "font-semibold text-primary" : "text-foreground",
            )}
          >
            {client.posts}
          </div>
          <div className="text-right font-mono text-sm text-status-posted">
            {client.posted}
          </div>
          <div className="text-right font-mono text-sm text-status-not-posted">
            {client.backlogs}
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
