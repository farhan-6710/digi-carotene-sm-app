import type { DirectoryTableColumn } from "@/shared/types/components";

export const POSTS_DAYS_LIST_GRID_CLASS =
  "grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1.4fr)]";
export const POSTS_DAYS_LIST_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1.4fr)]";

export const postsDaysListColumns: DirectoryTableColumn[] = [
  { label: "DAY" },
  { label: "WEEKDAY" },
  { label: "POSTS" },
  { label: "STATUS MIX" },
];

export const postsDaysListDirectoryConfig = {
  title: "Days this month",
  description: "Each day as a row. Open a day to review its scheduled posts.",
  gridClass: POSTS_DAYS_LIST_GRID_CLASS,
  columns: postsDaysListColumns,
  emptyMessage: "No days in this month.",
} as const;
