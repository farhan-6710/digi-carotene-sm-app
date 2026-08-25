import type { DirectoryTableColumn } from "@/shared/types/components";

export const PRODUCTION_PLANNER_GRID_CLASS =
  "grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_5rem]";
export const PRODUCTION_PLANNER_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_5rem]";

export const productionPlannerColumns: DirectoryTableColumn[] = [
  { label: "PLAN" },
  { label: "CLIENT" },
  { label: "SHOOT DATE" },
  { label: "DELIVERABLES" },
  { label: "ACTIONS", align: "right" },
];

export const productionPlannerDirectoryConfig = {
  title: "Production Plans",
  description: "Client production schedules and deliverable targets.",
  gridClass: PRODUCTION_PLANNER_GRID_CLASS,
  columns: productionPlannerColumns,
  emptyMessage: "No production plans yet.",
} as const;

export const productionPlanContentsListConfig = {
  title: "Plan Content",
  description:
    "Each piece of content is its own card. Scan titles and notes together, then edit when needed.",
  emptyMessage: "No content in this plan yet. Add the first content to get started.",
} as const;

/** Preview lines shown on content cards before truncating. */
export const CONTENT_SCRIPT_PREVIEW_LINES = 8;
