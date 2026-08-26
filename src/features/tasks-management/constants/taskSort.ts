export const TASK_SORTS = [
  "eta_asc",
  "eta_desc",
  "priority_desc",
  "priority_asc",
  "title_asc",
  "newest",
  "oldest",
] as const;

export type TaskSortId = (typeof TASK_SORTS)[number];

export const TASK_SORT_PARAM = "sort";

export const DEFAULT_TASK_SORT: TaskSortId = "eta_asc";

export const TASK_SORT_LABELS: Record<TaskSortId, string> = {
  eta_asc: "ETA ascending",
  eta_desc: "ETA descending",
  priority_desc: "Priority high → low",
  priority_asc: "Priority low → high",
  title_asc: "Title A–Z",
  newest: "Newest first",
  oldest: "Oldest first",
};
