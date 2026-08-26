import type { DirectoryTableColumn } from "@/shared/types/components";

export const REPORTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,1fr)]";
export const REPORTS_DIRECTORY_ROW_GRID_CLASS =
  "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,1fr)]";

export const reportsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "CLIENT" },
  { label: "TO BE POSTED ON" },
  { label: "TIME" },
  { label: "STATUS" },
  { label: "POSTED ON" },
];

export const reportsDirectoryConfig = {
  title: "Client activity report",
  gridClass: REPORTS_DIRECTORY_GRID_CLASS,
  columns: reportsDirectoryColumns,
} as const;
