import type { StatusKey } from "@/features/posts-management/types/types";

const TODAY_POST_STATUS_SORT_ORDER: Record<StatusKey, number> = {
  editing: 0,
  sent_for_approval: 1,
  approved: 2,
  scheduled: 3,
  posted: 4,
};

export function getTodayPostStatusSortOrder(status: StatusKey): number {
  return TODAY_POST_STATUS_SORT_ORDER[status];
}
