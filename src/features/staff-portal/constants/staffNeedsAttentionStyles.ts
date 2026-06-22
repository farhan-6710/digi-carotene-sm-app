import type {
  AdminNeedsAttentionStatus,
  AdminNeedsAttentionStatusStyle,
} from "@/features/admin-dashboard/types/types";

export const adminNeedsAttentionStatusStyles: Record<
  AdminNeedsAttentionStatus,
  AdminNeedsAttentionStatusStyle
> = {
  Missed: { dot: "bg-status-missed", text: "text-status-missed" },
  "Due Today": { dot: "bg-status-scheduled", text: "text-status-scheduled" },
  "Needs Review": { dot: "bg-primary", text: "text-primary" },
};
