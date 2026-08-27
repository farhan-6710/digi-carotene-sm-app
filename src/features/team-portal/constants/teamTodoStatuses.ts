import type { TeamTodoStatus } from "@/features/team-portal/types/types";

export const TEAM_TODO_STATUSES: TeamTodoStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

export const TEAM_TODO_STATUS_LABELS: Record<TeamTodoStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

export const TEAM_TODO_STATUS_DOT_CLASS: Record<TeamTodoStatus, string> = {
  pending: "bg-muted-foreground/50",
  in_progress: "bg-primary",
  completed: "bg-status-posted",
};
