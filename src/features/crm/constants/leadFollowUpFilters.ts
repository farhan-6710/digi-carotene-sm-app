/** Order: default → most urgent → upcoming → rest. */
export const LEAD_FOLLOW_UP_FILTERS = [
  "all",
  "overdue",
  "upcoming",
  "all_pending",
  "no_response",
  "completed",
] as const;

export type LeadFollowUpFilterId = (typeof LEAD_FOLLOW_UP_FILTERS)[number];

export const DEFAULT_LEAD_FOLLOW_UP_FILTER: LeadFollowUpFilterId = "all";

export const LEAD_FOLLOW_UP_FILTER_LABELS: Record<LeadFollowUpFilterId, string> =
  {
    all: "All leads",
    overdue: "Follow-up overdue",
    upcoming: "Follow-up upcoming",
    all_pending: "All Follow-ups",
    no_response: "Follow-up no response",
    completed: "Completed",
  };
