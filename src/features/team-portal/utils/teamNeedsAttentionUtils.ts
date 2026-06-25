import type { Post } from "@/features/posts-management/types/types";
import type { TeamNeedsAttentionItem } from "@/features/team-portal/types/types";
import {
  buildDashboardPostLabel,
  buildNeedsAttentionScheduleLabel,
  getPostDueTimestamp,
  getTodayPostDateString,
  isPostOverdue,
} from "@/features/team-portal/utils/teamDashboardPostUtils";

export function mapNotPostedPostsToNeedsAttention(
  posts: Post[],
  now = new Date(),
): TeamNeedsAttentionItem[] {
  const today = getTodayPostDateString(now);

  return posts
    .filter((post) => post.to_be_posted_date !== today)
    .map((post) => {
      const isOverdue = isPostOverdue(post, now);

      return {
        item: {
          id: post.id,
          label: buildDashboardPostLabel(post),
          postStatus: post.status,
          scheduleLabel: buildNeedsAttentionScheduleLabel(
            post.to_be_posted_date,
            post.to_be_posted_time,
            now,
          ),
          isOverdue,
        },
        dueAt: getPostDueTimestamp(post),
      };
    })
    .sort((a, b) => {
      if (a.item.isOverdue !== b.item.isOverdue) {
        return a.item.isOverdue ? -1 : 1;
      }

      return a.dueAt - b.dueAt;
    })
    .map(({ item }) => item);
}
