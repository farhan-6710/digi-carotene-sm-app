import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_PROJECTS_GRID_CLASS =
  "grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr]";
export const CLIENT_PROJECTS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr]";

export const clientProjectsColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "MANAGER" },
  { label: "SOCIALS" },
  { label: "STATUS" },
];

export const clientProjectsDirectoryConfig = {
  title: "Projects",
  description: "Social profiles and posting accounts for your brand.",
  gridClass: CLIENT_PROJECTS_GRID_CLASS,
  columns: clientProjectsColumns,
  emptyMessage: "No projects for your brand yet.",
} as const;
