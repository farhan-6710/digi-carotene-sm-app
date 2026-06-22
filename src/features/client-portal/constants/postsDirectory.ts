import type { DirectoryTableColumn } from "@/shared/types/components";

export const PORTAL_POSTS_GRID_CLASS =
  "grid-cols-[1.2fr_1fr_0.8fr_0.7fr]";
export const PORTAL_POSTS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr]";

export const portalPostsColumns: DirectoryTableColumn[] = [
  { label: "TITLE" },
  { label: "SCHEDULED" },
  { label: "PLATFORMS" },
  { label: "STATUS" },
];

export const portalPostsDirectoryConfig = {
  title: "Posts",
  description: "Read-only view of every post scheduled for your brand.",
  gridClass: PORTAL_POSTS_GRID_CLASS,
  columns: portalPostsColumns,
  emptyMessage: "No posts scheduled for your brand yet.",
} as const;
