import type { DirectoryTableColumn } from "@/shared/types/components";

export const TEAM_DIRECTORY_GRID_CLASS =
  "grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.6fr)]";
export const TEAM_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.6fr)]";

export const teamDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NAME" },
  { label: "EMAIL" },
  { label: "MOBILE NUMBER" },
  { label: "TEAM MEMBER ROLE" },
  { label: "ACTIONS", align: "right" },
];

export const teamDirectoryConfig = {
  title: "Team Directory",
  description: "Digi Carotene team and their roles.",
  gridClass: TEAM_DIRECTORY_GRID_CLASS,
  columns: teamDirectoryColumns,
  emptyMessage:
    'No team members found. Click "Add Team Member" to get started.',
} as const;
