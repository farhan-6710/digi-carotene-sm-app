import type { StatusKey } from "@/features/posts-management/types/types";

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