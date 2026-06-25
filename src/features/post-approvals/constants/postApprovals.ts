export const POST_APPROVAL_REQUEST_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export const POST_APPROVAL_STATUS_LABELS = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export const POST_APPROVALS_PATH = "/team-portal/post-approvals";

export const POST_APPROVALS_UPDATED_EVENT = "post-approvals-updated";

export const postApprovalsDirectoryConfig = {
  title: "Post approvals",
  description:
    "Review backdated post requests from executives before they are added to the calendar.",
  gridClass:
    "grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] gap-4",
  columns: [
    { label: "Post" },
    { label: "Project" },
    { label: "To be posted" },
    { label: "Requested" },
    { label: "Actions", align: "right" as const },
  ],
  emptyMessage: "No pending approval requests right now.",
} as const;
