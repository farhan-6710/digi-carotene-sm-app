import type { DirectoryTableColumn } from "@/shared/types/components";

export const CONVERSIONS_GRID_CLASS =
  "grid-cols-[1.2fr_1.1fr_1.3fr_1fr_1fr_1fr]";
export const CONVERSIONS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_1.1fr_1.3fr_1fr_1fr_1fr]";

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
