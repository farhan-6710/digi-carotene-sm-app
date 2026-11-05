import type { StatusKey } from "@/features/posts-management/types/types";

export const postStatusFilterAllActiveStyle =
  "border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/25";

export const postStatusFilterAllInactiveStyle =
  "border-border/60 bg-muted/30 text-muted-foreground/55";

export const postStatusFilterActiveStyles: Record<StatusKey, string> = {
  editing:
    "border-status-editing/50 bg-status-editing/20 text-status-editing ring-1 ring-status-editing/25",
  sent_for_approval:
    "border-status-sent-for-approval/50 bg-status-sent-for-approval/20 text-status-sent-for-approval ring-1 ring-status-sent-for-approval/25",
  approved:
    "border-status-approved/50 bg-status-approved/20 text-status-approved ring-1 ring-status-approved/25",
  scheduled:
    "border-status-scheduled/50 bg-status-scheduled/20 text-status-scheduled ring-1 ring-status-scheduled/25",
  posted:
    "border-status-posted/50 bg-status-posted/20 text-status-posted ring-1 ring-status-posted/25",
};

export const postStatusFilterInactiveStyles: Record<StatusKey, string> = {
  editing: "border-border/60 bg-muted/30 text-muted-foreground/55",
  sent_for_approval: "border-border/60 bg-muted/30 text-muted-foreground/55",
  approved: "border-border/60 bg-muted/30 text-muted-foreground/55",
  scheduled: "border-border/60 bg-muted/30 text-muted-foreground/55",
  posted: "border-border/60 bg-muted/30 text-muted-foreground/55",
};
