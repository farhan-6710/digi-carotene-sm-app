import type { Post } from "@/features/posts-management/types/types";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import { getTodayPostStatusSortOrder } from "@/features/team-portal/constants/teamTodaysPosts";
import type { TeamTodaysPostItem } from "@/features/team-portal/types/types";
import {
  buildDashboardPostLabel,
  buildTodaysPostScheduleLabel,
  getPostDueTimestamp,
  isPostOverdue,
} from "@/features/team-portal/utils/teamDashboardPostUtils";

export function mapPostsToTodaysPosts(posts: Post[]): TeamTodaysPostItem[] {
  const now = new Date();

  return posts
    .map((post) => {
      const dueAt = parseDateTime(post.to_be_posted_date, post.to_be_posted_time);
      const isOverdue = isPostOverdue(post, now);

      return {
        item: {
          id: post.id,
          label: buildDashboardPostLabel(post),
          postStatus: post.status,
          toBePostedTime: post.to_be_posted_time,
          scheduleLabel: buildTodaysPostScheduleLabel(
            post.to_be_posted_time,
            now,
            dueAt,
            post.status,
          ),
          isOverdue,
        },
        dueAt: getPostDueTimestamp(post),
        statusOrder: getTodayPostStatusSortOrder(post.status),
      };
    })
    .sort((a, b) => {
      if (a.statusOrder !== b.statusOrder) {
        return a.statusOrder - b.statusOrder;
      }

      if (a.item.isOverdue !== b.item.isOverdue) {
        return a.item.isOverdue ? -1 : 1;
      }

      return a.dueAt - b.dueAt;
    })
    .map(({ item }) => item);
}
