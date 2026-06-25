import { Check, Loader2, MoreVertical } from "lucide-react";

import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { TEAM_DASHBOARD_POST_STATUS_OPTIONS } from "@/features/team-portal/constants/teamDashboardPostStatus";
import type { TeamDashboardPostRowProps } from "@/features/team-portal/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

function TeamDashboardPostRow({
  row,
  onStatusChange,
  isUpdating,
}: TeamDashboardPostRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:bg-muted/40">
      <div
        className={cn(
          "mt-2 size-2 shrink-0 rounded-full",
          statusColors[row.postStatus],
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-medium text-foreground">
            {row.label}
          </div>
          <div
            className={cn(
              "shrink-0 text-[10px] font-semibold uppercase tracking-wide",
              statusText[row.postStatus],
            )}
          >
            {row.postStatus}
          </div>
        </div>
        <div className="mt-1 font-mono text-xs text-muted-foreground">
          {row.scheduleLabel}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            disabled={isUpdating}
            aria-label={`Actions for ${row.label}`}
          >
            {isUpdating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuLabel>Post status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TEAM_DASHBOARD_POST_STATUS_OPTIONS.map((status) => {
            const isSelected = row.postStatus === status;

            return (
              <DropdownMenuItem
                key={status}
                className={cn(
                  statusText[status],
                  isSelected && "bg-muted/50 font-medium",
                )}
                onSelect={(event) => {
                  if (isSelected) {
                    event.preventDefault();
                    return;
                  }

                  onStatusChange(row.id, status);
                }}
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    statusColors[status],
                  )}
                />
                <span className="flex-1">{status}</span>
                {isSelected ? (
                  <Check className="size-4 shrink-0 text-muted-foreground" />
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { TeamDashboardPostRow };
