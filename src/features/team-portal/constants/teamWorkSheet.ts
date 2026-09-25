export const TEAM_WORK_SHEET_TABS = ["todos", "tasks", "activities"] as const;

export type TeamWorkSheetTabId = (typeof TEAM_WORK_SHEET_TABS)[number];

export const DEFAULT_TEAM_WORK_SHEET_TAB: TeamWorkSheetTabId = "todos";

export const TEAM_WORK_SHEET_TAB_LABELS: Record<TeamWorkSheetTabId, string> = {
  todos: "To-dos",
  tasks: "Tasks",
  activities: "Activities",
};

export const TEAM_WORK_SHEET_TAB_DESCRIPTIONS: Record<
  TeamWorkSheetTabId,
  string
> = {
  todos: "Personal to-dos. Delete after you mark them completed.",
  tasks: "Same tasks as Task Management — open a row for the full page.",
  activities: "CRM lead activities across all leads.",
};

export const teamWorkSheetConfig = {
  title: "Work",
  triggerOpenLabel: "Open work panel",
  triggerCloseLabel: "Close work panel",
} as const;
