import type { DirectoryTableColumn } from "@/shared/types/components";

export const DEV_PROJECTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.55fr)_minmax(0,0.5fr)]";
export const DEV_PROJECTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.55fr)_minmax(0,0.5fr)]";

export const devProjectsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "CLIENT" },
  { label: "MANAGER" },
  { label: "TECH STACK" },
  { label: "TARGET" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const devProjectsDirectoryConfig = {
  title: "Development Projects",
  description:
    "Track client development work — stack, repo, and environment links.",
  gridClass: DEV_PROJECTS_DIRECTORY_GRID_CLASS,
  columns: devProjectsDirectoryColumns,
  emptyMessage:
    "No development projects yet. Add a client first, then create a project.",
} as const;
