import type { DirectoryTableColumn } from "@/shared/types/components";

export const TEAM_DIRECTORY_GRID_CLASS =
  "grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.6fr]";
export const TEAM_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.6fr]";

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
