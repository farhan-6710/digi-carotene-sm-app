import type { StatusKey } from "@/features/posts-management/types/types";

export type TeamDashboardPostItem = {
  id: string;
  label: string;
  postStatus: StatusKey;
  scheduleLabel: string;
};

export type TeamNeedsAttentionItem = TeamDashboardPostItem & {
  isOverdue: boolean;
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
