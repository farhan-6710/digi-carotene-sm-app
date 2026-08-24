import type { DirectoryTableColumn } from "@/shared/types/components";

export const CONTACTS_GRID_CLASS =
  "grid-cols-[1.2fr_1.1fr_1.3fr_1fr_1fr_1fr]";
export const CONTACTS_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_1.1fr_1.3fr_1fr_1fr_1fr]";

export const contactsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "EMAIL" },
  { label: "PHONE" },
  { label: "INDUSTRY" },
  { label: "SOURCE" },
];

export const contactsDirectoryConfig = {
  title: "Contacts Directory",
  description:
    "Converted leads (score 5). These contacts successfully completed conversion.",
  gridClass: CONTACTS_GRID_CLASS,
  columns: contactsDirectoryColumns,
  emptyMessage: "No contacts yet. Set a lead’s score to 5 to mark conversion.",
} as const;
