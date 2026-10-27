import { LEAD_FOLLOW_UP_STATUS_LABELS } from "@/features/crm/constants/leadFollowUpStatuses";
import type { LeadFollowUpBadgeProps } from "@/features/crm/types/components";
import { cn } from "@/shared/lib/utils";

export function LeadFollowUpBadge({ kind }: LeadFollowUpBadgeProps) {
  if (kind === "overdue") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
          "bg-destructive/10 text-destructive",
        )}
      >
        Time Passed
      </span>
    );
  }

  if (kind === "upcoming") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        )}
      >
        Upcoming
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        "bg-muted text-muted-foreground",
      )}
    >
      {LEAD_FOLLOW_UP_STATUS_LABELS[kind]}
    </span>
  );
}
