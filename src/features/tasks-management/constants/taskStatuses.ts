export const TASK_STATUSES = ["pending", "in_progress", "completed"] as const;

export const TASK_STATUS_LABELS: Record<(typeof TASK_STATUSES)[number], string> =
  {
    pending: "Pending",
    in_progress: "In progress",
    completed: "Completed",
  };
