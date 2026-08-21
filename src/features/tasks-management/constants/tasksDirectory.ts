export const TASKS_GRID_CLASS =
  "grid-cols-[1.4fr_1fr_0.85fr_0.85fr_0.55fr_1fr_0.6fr_auto]";
export const TASKS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.4fr_1fr_0.85fr_0.85fr_0.55fr_1fr_0.6fr_auto]";

export const tasksColumns: import("@/shared/types/components").DirectoryTableColumn[] =
  [
    { label: "TITLE" },
    { label: "PROJECT" },
    { label: "RAISED BY" },
    { label: "ASSIGNED TO" },
    { label: "PRIORITY" },
    { label: "ETA" },
    { label: "STATUS" },
    { label: "ACTIONS", align: "right" },
  ];

export const tasksDirectoryConfig = {
  title: "Task Management",
  description:
    "Project tasks with priority and ETA. Admins and project managers see oversight lists.",
  gridClass: TASKS_GRID_CLASS,
  columns: tasksColumns,
  emptyMessage: "No tasks yet.",
} as const;
