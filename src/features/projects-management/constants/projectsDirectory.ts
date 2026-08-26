import type { DirectoryTableColumn } from "@/shared/types/components";

export const PROJECTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.5fr)]";
export const PROJECTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.5fr)]";

export const projectsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "CLIENT" },
  { label: "MANAGER" },
  { label: "SOCIALS" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const projectsDirectoryConfig = {
  title: "Social Media Projects",
  description:
    "Each SM project belongs to a client and has its own social accounts and team.",
  gridClass: PROJECTS_DIRECTORY_GRID_CLASS,
  columns: projectsDirectoryColumns,
  emptyMessage:
    "No social media projects found. Add a client first, then create your first project.",
} as const;
