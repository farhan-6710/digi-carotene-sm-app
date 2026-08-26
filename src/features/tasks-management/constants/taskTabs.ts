export const TASK_TABS = ["all", "raised_by_me", "raised_for_me"] as const;

export type TaskTabId = (typeof TASK_TABS)[number];

export const TASK_TAB_PARAM = "tab";

export const TASK_TAB_LABELS: Record<TaskTabId, string> = {
  all: "All",
  raised_by_me: "Raised by me",
  raised_for_me: "Raised for me",
};

export const DEFAULT_TASK_TAB: TaskTabId = "all";
