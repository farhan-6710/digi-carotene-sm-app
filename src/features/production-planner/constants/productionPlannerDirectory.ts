import type { DirectoryTableColumn } from "@/shared/types/components";

export const PRODUCTION_PLANNER_GRID_CLASS =
  "grid-cols-[1.4fr_1fr_0.9fr_1.2fr_auto]";
export const PRODUCTION_PLANNER_ROW_GRID_CLASS =
  "sm:grid-cols-[1.4fr_1fr_0.9fr_1.2fr_auto]";

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
