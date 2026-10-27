import type { LeadFollowUpStatus } from "@/features/crm/types/types";

export const LEAD_FOLLOW_UP_STATUSES: LeadFollowUpStatus[] = [
  "pending",
  "didnt_respond",
  "done",
];

export const LEAD_FOLLOW_UP_STATUS_LABELS: Record<LeadFollowUpStatus, string> = {
  pending: "Pending",
  didnt_respond: "No Response",
  done: "Done",
};
