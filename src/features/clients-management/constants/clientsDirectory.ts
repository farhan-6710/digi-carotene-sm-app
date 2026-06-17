import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENTS_DIRECTORY_GRID_CLASS = "grid-cols-[1.4fr_1fr_1.8fr_0.6fr]";
export const CLIENTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[1.4fr_1fr_1.8fr_0.6fr]";

export const clientsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "CLIENT NAME" },
  { label: "MOBILE NUMBER" },
  { label: "WEBSITE" },
  { label: "ACTIONS", align: "right" },
];

export const clientsDirectoryConfig = {
  title: "Clients Directory",
  description:
    "Company registry for portal access. Social accounts live on projects.",
  gridClass: CLIENTS_DIRECTORY_GRID_CLASS,
  columns: clientsDirectoryColumns,
  emptyMessage:
    'No clients found. Click "Add Client" to register your first client.',
} as const;
