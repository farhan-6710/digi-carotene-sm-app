export const SUBTASKS_GRID_CLASS =
  "grid-cols-[1.5fr_0.9fr_0.9fr_0.55fr_1fr_0.6fr_auto]";
export const SUBTASKS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.5fr_0.9fr_0.9fr_0.55fr_1fr_0.6fr_auto]";

export const subtasksColumns: import("@/shared/types/components").DirectoryTableColumn[] =
  [
    { label: "TITLE" },
    { label: "RAISED BY" },
    { label: "ASSIGNED TO" },
    { label: "PRIORITY" },
    { label: "ETA" },
    { label: "STATUS" },
    { label: "ACTIONS", align: "right" },
  ];

export const subtasksDirectoryConfig = {
  title: "Subtasks",
  description:
    "Break this task into smaller items. Anyone on the task can add a subtask.",
  gridClass: SUBTASKS_GRID_CLASS,
  columns: subtasksColumns,
  emptyMessage: "No subtasks yet.",
} as const;
