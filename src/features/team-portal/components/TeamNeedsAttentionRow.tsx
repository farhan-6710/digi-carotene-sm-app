import { Link } from "react-router";

import type { TeamNeedsAttentionRowProps } from "@/features/team-portal/types/components";
import { cn } from "@/shared/lib/utils";

export function TeamNeedsAttentionRow({ row }: TeamNeedsAttentionRowProps) {
  return (
    <Link
      to={row.href}
      className="block rounded-xl border border-border bg-background/70 px-4 py-3 transition hover:border-ring/50 hover:bg-muted/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.kind === "subtask" ? "Subtask" : "Task"} · {row.statusLabel} ·{" "}
            {row.scheduleLabel}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            row.priority === "high" && "bg-destructive/10 text-destructive",
            row.priority === "medium" && "bg-accent/10 text-accent",
            row.priority === "low" && "bg-muted text-muted-foreground",
          )}
        >
          {row.priorityLabel}
        </span>
      </div>
    </Link>
  );
}
