import type { StatusKey } from "@/features/posts-management/types/types";

export const postStatusFilterAllActiveStyle =
  "border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/25";

export const postStatusFilterAllInactiveStyle =
  "border-border/60 bg-muted/30 text-muted-foreground/55";

export const postStatusFilterActiveStyles: Record<StatusKey, string> = {
  "Not posted":
    "border-status-not-posted/50 bg-status-not-posted/20 text-status-not-posted ring-1 ring-status-not-posted/25",
  Scheduled:
    "border-status-scheduled/50 bg-status-scheduled/20 text-status-scheduled ring-1 ring-status-scheduled/25",
  Posted:
    "border-status-posted/50 bg-status-posted/20 text-status-posted ring-1 ring-status-posted/25",
};

export const postStatusFilterInactiveStyles: Record<StatusKey, string> = {
  "Not posted": "border-border/60 bg-muted/30 text-muted-foreground/55",
  Scheduled: "border-border/60 bg-muted/30 text-muted-foreground/55",
  Posted: "border-border/60 bg-muted/30 text-muted-foreground/55",
};
