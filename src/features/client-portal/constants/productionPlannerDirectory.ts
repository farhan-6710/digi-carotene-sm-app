import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_PLANS_GRID_CLASS = "grid-cols-[1.4fr_0.9fr_1.2fr]";
export const CLIENT_PLANS_ROW_GRID_CLASS = "sm:grid-cols-[1.4fr_0.9fr_1.2fr]";

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
