export const SUBTASKS_GRID_CLASS =
  "grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,0.6fr)_5rem]";
export const SUBTASKS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,0.6fr)_5rem]";

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
