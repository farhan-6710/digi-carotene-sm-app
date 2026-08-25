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

export const POST_APPROVALS_UPDATED_EVENT = "post-approvals-updated";

export const postApprovalsDirectoryConfig = {
  title: "Approvals",
  description:
    "Backdated posts from executives waiting for approve or reject.",
  gridClass:
    "grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_5rem]",
  columns: [
    { label: "POST" },
    { label: "PROJECT" },
    { label: "TO BE POSTED" },
    { label: "REQUESTED" },
    { label: "ACTIONS", align: "right" as const },
  ],
  emptyMessage: "No pending approval requests.",
} as const;
