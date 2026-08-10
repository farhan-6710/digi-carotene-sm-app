import type { DirectoryTableColumn } from "@/shared/types/components";

export const PRODUCTION_PLANNER_GRID_CLASS =
  "grid-cols-[1.4fr_1fr_0.9fr_1.2fr_auto]";
export const PRODUCTION_PLANNER_ROW_GRID_CLASS =
  "sm:grid-cols-[1.4fr_1fr_0.9fr_1.2fr_auto]";

export const productionPlannerColumns: DirectoryTableColumn[] = [
  { label: "PLAN" },
  { label: "CLIENT" },
  { label: "START DATE" },
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

export const PRODUCTION_PLAN_ITEMS_GRID_CLASS =
  "grid-cols-[2fr_1fr_1fr_auto]";

export const productionPlanItemsColumns: DirectoryTableColumn[] = [
  { label: "ITEM" },
  { label: "MANAGER/ADMIN APPROVAL" },
  { label: "SHOOT INCHARGE APPROVAL" },
  { label: "ACTIONS", align: "right" },
];

export const productionPlanItemsDirectoryConfig = {
  title: "Plan Items",
  description:
    "Individual items in this plan. Each item tracks manager/admin and shoot incharge approval.",
  gridClass: PRODUCTION_PLAN_ITEMS_GRID_CLASS,
  columns: productionPlanItemsColumns,
  emptyMessage: "No items in this plan yet. Add the first item to get started.",
} as const;
