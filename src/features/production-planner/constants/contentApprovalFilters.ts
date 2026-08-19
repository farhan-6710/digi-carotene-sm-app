export const CONTENT_APPROVAL_FILTERS = [
  "all",
  "both_approved",
  "manager_approved_only",
  "shoot_approved_only",
  "manager_approved",
  "shoot_approved",
  "client_approved",
  "pending",
  "rejected",
] as const;

export type ContentApprovalFilterId = (typeof CONTENT_APPROVAL_FILTERS)[number];

export const CONTENT_APPROVAL_FILTER_LABELS: Record<
  ContentApprovalFilterId,
  string
> = {
  all: "All content",
  both_approved: "All approved",
  manager_approved_only: "Only Manager/Admin approved",
  shoot_approved_only: "Only Shoot Incharge approved",
  manager_approved: "Manager/Admin approved",
  shoot_approved: "Shoot Incharge approved",
  client_approved: "Client approved",
  pending: "Pending approval",
  rejected: "Rejected",
};

export const DEFAULT_CONTENT_APPROVAL_FILTER: ContentApprovalFilterId = "all";
