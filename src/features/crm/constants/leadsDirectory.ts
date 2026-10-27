import type { DirectoryTableColumn } from "@/shared/types/components";

export const LEADS_GRID_CLASS =
  "grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.45fr)_minmax(0,0.85fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_4.5rem]";
export const LEADS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.45fr)_minmax(0,0.85fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_4.5rem]";

export const leadsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "EMAIL" },
  { label: "PHONE" },
  { label: "INDUSTRY" },
  { label: "SCORE" },
  { label: "STATUS" },
  { label: "SOURCE" },
  { label: "FOLLOW-UP" },
  { label: "ACTIONS", align: "right" },
];

export const leadsDirectoryConfig = {
  title: "Leads Directory",
  description:
    "Track inbound leads. Keep contact details, pipeline status, and follow-ups up to date.",
  gridClass: LEADS_GRID_CLASS,
  columns: leadsDirectoryColumns,
  emptyMessage: 'No leads yet. Click "Create Lead" to add your first lead.',
} as const;
