import type { DirectoryTableColumn } from "@/shared/types/components";

export const PROJECT_POSTS_GRID_CLASS =
  "grid-cols-[1.2fr_1fr_1fr_0.8fr_0.7fr_0.5fr]";
export const PROJECT_POSTS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.7fr_0.5fr]";

export const projectPostsColumns: DirectoryTableColumn[] = [
  { label: "TITLE" },
  { label: "TO BE POSTED ON" },
  { label: "POSTED ON" },
  { label: "PLATFORMS" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const projectPostsDirectoryConfig = {
  title: "Posts",
  description: "All posts for this project, newest to-be-posted date first.",
  gridClass: PROJECT_POSTS_GRID_CLASS,
  columns: projectPostsColumns,
  emptyMessage: "No posts for this project in the selected month.",
} as const;
