import { Link } from "react-router";
import { Loader2 } from "lucide-react";

import { TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT } from "@/features/team-portal/constants/teamDashboardPosts";
import { TeamDashboardPostRow } from "@/features/team-portal/components/TeamDashboardPostRow";
import type { TeamDashboardPostListProps } from "@/features/team-portal/types/components";

export function TeamDashboardPostList({
  title,
  items,
  isLoading,
  error,
  emptyMessage,
  onStatusChange,
  updatingPostId,
}: TeamDashboardPostListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <Link
          to="/team-portal/posts-management"
          className="text-sm font-medium text-primary hover:underline"
        >
          View posts <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      ) : isLoading ? (
        <div className="mt-8 flex justify-center py-6">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div
          className={[
            "mt-4 space-y-3 overflow-y-auto pr-1",
            TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT,
          ].join(" ")}
        >
          {items.map((row) => (
            <TeamDashboardPostRow
              key={row.id}
              row={row}
              onStatusChange={onStatusChange}
              isUpdating={updatingPostId === row.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
