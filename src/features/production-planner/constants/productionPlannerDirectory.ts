import type { DirectoryTableColumn } from "@/shared/types/components";

export const PRODUCTION_PLANNER_GRID_CLASS =
  "grid-cols-[2fr_1fr_1fr_auto]";

export const productionPlannerColumns: DirectoryTableColumn[] = [
  { label: "PLAN NAME & CLIENT" },
  { label: "MANAGER APPROVAL" },
  { label: "SHOOT INCHARGE APPROVAL" },
  { label: "ACTIONS", align: "right" },
];

export const productionPlannerDirectoryConfig = {
  title: "Production Plans",
  description:
    "Client production schedules, deliverables, and approval milestones.",
  gridClass: PRODUCTION_PLANNER_GRID_CLASS,
  columns: productionPlannerColumns,
  emptyMessage: "No production plans yet.",
} as const;
