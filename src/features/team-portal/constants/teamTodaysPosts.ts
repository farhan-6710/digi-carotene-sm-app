import type { StatusKey } from "@/features/posts-management/types/types";

const TODAY_POST_STATUS_SORT_ORDER: Record<StatusKey, number> = {
  "Not posted": 0,
  Scheduled: 1,
  Posted: 2,
};

export function getTodayPostStatusSortOrder(status: StatusKey): number {
  return TODAY_POST_STATUS_SORT_ORDER[status];
}
