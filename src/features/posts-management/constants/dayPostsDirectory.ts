import type { DirectoryTableColumn } from "@/shared/types/components";

export const DAY_POSTS_GRID_CLASS =
  "grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.5fr)]";
export const DAY_POSTS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.5fr)]";

export const dayPostsColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "TITLE" },
  { label: "TIME" },
  { label: "PLATFORMS" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const dayPostsDirectoryConfig = {
  title: "Scheduled posts",
  description: "All posts scheduled for this day, ordered by time.",
  gridClass: DAY_POSTS_GRID_CLASS,
  columns: dayPostsColumns,
  emptyMessage: "No posts scheduled for this day yet.",
} as const;
