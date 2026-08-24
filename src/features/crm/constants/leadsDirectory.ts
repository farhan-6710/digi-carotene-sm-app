import type { DirectoryTableColumn } from "@/shared/types/components";

export const LEADS_GRID_CLASS =
  "grid-cols-[1.1fr_1fr_1.1fr_0.9fr_0.9fr_0.55fr_1fr_0.9fr_auto]";
export const LEADS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.1fr_1fr_1.1fr_0.9fr_0.9fr_0.55fr_1fr_0.9fr_auto]";

export const leadsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "EMAIL" },
  { label: "PHONE" },
  { label: "INDUSTRY" },
  { label: "SCORE" },
  { label: "STATUS" },
  { label: "SOURCE" },
  { label: "ACTIONS", align: "right" },
];

export const leadsDirectoryConfig = {
  title: "Leads Directory",
  description: "Track inbound leads. Keep contact details and pipeline status up to date.",
  gridClass: LEADS_GRID_CLASS,
  columns: leadsDirectoryColumns,
  emptyMessage: 'No leads yet. Click "Create Lead" to add your first lead.',
} as const;
