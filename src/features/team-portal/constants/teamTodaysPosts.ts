import type { StatusKey } from "@/features/posts-management/types/types";

const TODAY_POST_STATUS_SORT_ORDER: Record<StatusKey, number> = {
  editing: 0,
  sent_for_approval: 1,
  changes_suggested: 2,
  approved: 3,
  scheduled: 4,
  posted: 5,
};

export function getTodayPostStatusSortOrder(status: StatusKey): number {
  return TODAY_POST_STATUS_SORT_ORDER[status];
}
