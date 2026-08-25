import type { DirectoryTableColumn } from "@/shared/types/components";

export const PROJECT_POSTS_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.5fr)]";
export const PROJECT_POSTS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.5fr)]";

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
  description: "Posts scheduled in the selected period for this project.",
  gridClass: PROJECT_POSTS_GRID_CLASS,
  columns: projectPostsColumns,
  emptyMessage: "No posts for this project in the selected period.",
} as const;
