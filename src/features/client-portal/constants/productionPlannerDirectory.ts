import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_PLANS_GRID_CLASS = "grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]";
export const CLIENT_PLANS_ROW_GRID_CLASS = "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]";

export const clientPlansColumns: DirectoryTableColumn[] = [
  { label: "PLAN" },
  { label: "SHOOT DATE" },
  { label: "DELIVERABLES" },
];

export const clientPlansDirectoryConfig = {
  title: "Production Plans",
  description: "Open a plan to review content and set your client approval.",
  gridClass: CLIENT_PLANS_GRID_CLASS,
  columns: clientPlansColumns,
  emptyMessage: "No production plans for your brand yet.",
} as const;
