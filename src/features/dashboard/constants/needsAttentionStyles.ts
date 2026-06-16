import type {
  NeedsAttentionStatus,
  NeedsAttentionStatusStyle,
} from "@/features/dashboard/types/types";

export const needsAttentionStatusStyles: Record<
  NeedsAttentionStatus,
  NeedsAttentionStatusStyle
> = {
  Missed: { dot: "bg-status-missed", text: "text-status-missed" },
  "Due Today": { dot: "bg-status-scheduled", text: "text-status-scheduled" },
  "Needs Review": { dot: "bg-primary", text: "text-primary" },
};
