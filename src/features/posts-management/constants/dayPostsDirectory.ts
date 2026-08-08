import type { DirectoryTableColumn } from "@/shared/types/components";

export const DAY_POSTS_GRID_CLASS =
  "grid-cols-[1.4fr_1fr_0.9fr_0.8fr_0.7fr_0.5fr]";
export const DAY_POSTS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.4fr_1fr_0.9fr_0.8fr_0.7fr_0.5fr]";

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
