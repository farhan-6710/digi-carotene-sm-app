export const TASK_STATUS_FILTERS = [
  "all",
  "pending",
  "in_progress",
  "incomplete",
  "completed",
] as const;

export type TaskStatusFilterId = (typeof TASK_STATUS_FILTERS)[number];

export const TASK_STATUS_FILTER_PARAM = "status";

/** Default shows unfinished work (pending + in progress). */
export const DEFAULT_TASK_STATUS_FILTER: TaskStatusFilterId = "incomplete";

export const TASK_STATUS_FILTER_LABELS: Record<TaskStatusFilterId, string> = {
  all: "All",
  pending: "Pending",
  in_progress: "In progress",
  incomplete: "Incomplete",
  completed: "Completed",
};
