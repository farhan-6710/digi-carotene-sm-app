import type {
  LeadActivityPriority,
  LeadActivityStatus,
} from "@/features/crm/types/types";

export const LEAD_ACTIVITY_STATUSES: LeadActivityStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

export const LEAD_ACTIVITY_STATUS_LABELS: Record<LeadActivityStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

export const LEAD_ACTIVITY_PRIORITIES: LeadActivityPriority[] = [
  "low",
  "medium",
  "high",
];

export const LEAD_ACTIVITY_PRIORITY_LABELS: Record<
  LeadActivityPriority,
  string
> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
