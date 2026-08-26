import type { DirectoryTableColumn } from "@/shared/types/components";

export const ANALYTICS_BREAKDOWN_GRID_CLASS =
  "grid-cols-[minmax(0,1.6fr)_minmax(0,0.6fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.8fr)]";

export function buildAnalyticsBreakdownColumns(
  nameHeader: string,
): DirectoryTableColumn[] {
  return [
    { label: nameHeader.toUpperCase() },
    { label: "TOTAL", align: "right" },
    { label: "POSTED", align: "right" },
    { label: "SCHEDULED", align: "right" },
    { label: "NOT POSTED", align: "right" },
  ];
}
