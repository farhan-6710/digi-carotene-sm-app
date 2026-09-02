import type { StatusKey } from "@/features/posts-management/types/types";

export type TeamDashboardPostItem = {
  id: string;
  label: string;
  postStatus: StatusKey;
  scheduleLabel: string;
};

import type { TaskPriority } from "@/features/tasks-management/types/types";

export type TeamNeedsAttentionItem = {
  id: string;
  kind: "task" | "subtask";
  label: string;
  priority: TaskPriority;
  priorityLabel: string;
  statusLabel: string;
  scheduleLabel: string;
  href: string;
};

export type TeamTodaysPostItem = TeamDashboardPostItem & {
  isOverdue: boolean;
  toBePostedTime: string;
};

export type PublishingComparisonPoint = {
  day: string;
  currentMonth: number;
  previousMonth: number;
};

export type PublishingComparisonChart = {
  points: PublishingComparisonPoint[];
  currentMonthLabel: string;
  previousMonthLabel: string;
  currentTotal: number;
  previousTotal: number;
  growthPercent: number | null;
};

export type TeamTodoStatus = "pending" | "in_progress" | "completed";

export type TeamTodo = {
  id: string;
  team_member_id: string;
  title: string;
  description: string | null;
  eta_date: string;
  eta_time: string;
  status: TeamTodoStatus;
  created_at: string;
  updated_at: string;
};

export type CreateTeamTodoInput = {
  title: string;
  description?: string | null;
  etaDate: string;
  etaTime: string;
  status: TeamTodoStatus;
};

export type UpdateTeamTodoInput = Partial<CreateTeamTodoInput>;
