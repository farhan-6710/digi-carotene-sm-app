import { Link } from "react-router";
import { Loader2 } from "lucide-react";

import { TASKS_MANAGEMENT_PATH } from "@/features/tasks-management/constants/routes";
import { TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT } from "@/features/team-portal/constants/teamDashboardPosts";
import { TeamNeedsAttentionRow } from "@/features/team-portal/components/TeamNeedsAttentionRow";
import type { TeamNeedsAttentionListProps } from "@/features/team-portal/types/components";

export function TeamNeedsAttentionList({
  items,
  isLoading,
  error,
}: TeamNeedsAttentionListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Needs Attention</div>
        <Link
          to={TASKS_MANAGEMENT_PATH}
          className="text-sm font-medium text-primary hover:underline"
        >
          View tasks <span aria-hidden="true">↗</span>
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
          No open tasks or subtasks where you&apos;re assigned or listed as a
          dependency.
        </p>
      ) : (
        <div
          className={[
            "mt-4 space-y-3 overflow-y-auto pr-1",
            TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT,
          ].join(" ")}
        >
          {items.map((row) => (
            <TeamNeedsAttentionRow key={`${row.kind}-${row.id}`} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
