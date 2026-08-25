import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.5fr)]";
export const CLIENTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.5fr)]";

export const clientsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "CLIENT NAME" },
  { label: "PRIMARY CONTACT PERSON" },
  { label: "MOBILE NUMBER" },
  { label: "WEBSITE" },
  { label: "STATUS" },
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
