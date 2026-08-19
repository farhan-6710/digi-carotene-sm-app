import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_POSTS_GRID_CLASS =
  "grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.7fr]";
export const CLIENT_POSTS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.7fr]";

export const clientPostsColumns: DirectoryTableColumn[] = [
  { label: "TITLE" },
  { label: "PROJECT" },
  { label: "TO BE POSTED ON" },
  { label: "PLATFORMS" },
  { label: "STATUS" },
];

export const clientPostsDirectoryConfig = {
  title: "Posts",
  description: "Read-only view of every post for your brand.",
  gridClass: CLIENT_POSTS_GRID_CLASS,
  columns: clientPostsColumns,
  emptyMessage: "No posts for your brand yet.",
} as const;
