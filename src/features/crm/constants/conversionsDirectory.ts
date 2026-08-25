import type { DirectoryTableColumn } from "@/shared/types/components";

export const CONVERSIONS_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";
export const CONVERSIONS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";

export const conversionsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "EMAIL" },
  { label: "PHONE" },
  { label: "INDUSTRY" },
  { label: "SOURCE" },
];

export const conversionsDirectoryConfig = {
  title: "Conversions Directory",
  description:
    "Leads with score 5 — conversion successful. These are won pipeline outcomes.",
  gridClass: CONVERSIONS_GRID_CLASS,
  columns: conversionsDirectoryColumns,
  emptyMessage:
    "No conversions yet. Set a lead’s score to 5 to mark conversion success.",
} as const;
