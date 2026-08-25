import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_PROJECTS_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.6fr)]";
export const CLIENT_PROJECTS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.6fr)]";

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
