export const TASK_STATUS_FILTERS = ["open", "completed", "all"] as const;

export type TaskStatusFilterId = (typeof TASK_STATUS_FILTERS)[number];

export const TASK_STATUS_FILTER_PARAM = "status";

/** Default hides completed so the list stays actionable. */
export const DEFAULT_TASK_STATUS_FILTER: TaskStatusFilterId = "open";

export const TASK_STATUS_FILTER_LABELS: Record<TaskStatusFilterId, string> = {
  open: "Open (hide completed)",
  completed: "Completed only",
  all: "All statuses",
};
