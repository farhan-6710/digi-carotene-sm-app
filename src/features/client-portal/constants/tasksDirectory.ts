import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_TASKS_GRID_CLASS =
  "grid-cols-[1.4fr_1fr_0.9fr_0.55fr_1fr_0.6fr]";
export const CLIENT_TASKS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.4fr_1fr_0.9fr_0.55fr_1fr_0.6fr]";

export const clientTasksColumns: DirectoryTableColumn[] = [
  { label: "TITLE" },
  { label: "PROJECT" },
  { label: "ASSIGNED TO" },
  { label: "PRIORITY" },
  { label: "ETA" },
  { label: "STATUS" },
];

export const clientTasksDirectoryConfig = {
  title: "Your tasks",
  description:
    "Tasks where your brand was included. Open a task to review details and chat with the team.",
  gridClass: CLIENT_TASKS_GRID_CLASS,
  columns: clientTasksColumns,
  emptyMessage: "No tasks for your brand yet.",
} as const;
