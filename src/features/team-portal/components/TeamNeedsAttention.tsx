import { Link } from "react-router";
import { Loader2 } from "lucide-react";

import { teamNeedsAttentionStatusStyle } from "@/features/team-portal/constants/teamNeedsAttentionStyles";
import { useTeamNeedsAttentionQuery } from "@/features/team-portal/hooks/useTeamNeedsAttentionQuery";

export function TeamNeedsAttention() {
  const { items, isLoading, error } = useTeamNeedsAttentionQuery();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Needs Attention</div>
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
          No not posted posts right now.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((row) => (
              <div
                key={row.id}
                className="flex items-start gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:bg-muted/40"
              >
                <div
                  className={[
                    "mt-2 size-2 shrink-0 rounded-full",
                    teamNeedsAttentionStatusStyle.dot,
                  ].join(" ")}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium text-foreground">
                      {row.label}
                    </div>
                    <div
                      className={[
                        "shrink-0 text-[10px] font-semibold uppercase tracking-wide",
                        teamNeedsAttentionStatusStyle.text,
                      ].join(" ")}
                    >
                      {row.status}
                    </div>
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    {row.scheduleLabel}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
