import type { DirectoryTableColumn } from "@/shared/types/components";

export const OTHER_PROJECTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,4.5rem)_minmax(0,2.75rem)]";
export const OTHER_PROJECTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,4.5rem)_minmax(0,2.75rem)]";

export const otherProjectsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "CLIENT" },
  { label: "MANAGER" },
  { label: "START" },
  { label: "ETA" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const otherProjectsDirectoryConfig = {
  title: "Other Projects",
  description: "Track non–social-media and non-development client work.",
  gridClass: OTHER_PROJECTS_DIRECTORY_GRID_CLASS,
  columns: otherProjectsDirectoryColumns,
  emptyMessage:
    "No other projects yet. Add a client first, then create a project.",
} as const;
