export const TASKS_GRID_CLASS =
  "grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,0.6fr)_5rem]";
export const TASKS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,0.6fr)_5rem]";

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
