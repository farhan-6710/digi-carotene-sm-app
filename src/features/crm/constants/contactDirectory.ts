import type { DirectoryTableColumn } from "@/shared/types/components";

export const CONTACT_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";
export const CONTACT_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";

export const contactDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "EMAIL" },
  { label: "PHONE" },
  { label: "INDUSTRY" },
  { label: "SOURCE" },
];

export const contactDirectoryConfig = {
  title: "Contact Directory",
  description:
    "Leads with score 5 — conversion successful. These are won pipeline outcomes.",
  gridClass: CONTACT_GRID_CLASS,
  columns: contactDirectoryColumns,
  emptyMessage:
    "No contacts yet. Set a lead’s score to 5 to mark conversion success.",
} as const;
