import type { Post, StatusKey } from "@/features/posts-management/types/types";
import { comparePostTimes } from "@/features/posts-management/utils/postScheduleUtils";

function countByStatus(posts: Post[], status: StatusKey): number {
  return posts.filter((post) => post.status === status).length;
}

export type PortalStat = {
  label: string;
  value: number;
};

export function buildPortalStats(posts: Post[]): PortalStat[] {
  return [
    { label: "Total posts", value: posts.length },
    { label: "Scheduled", value: countByStatus(posts, "Scheduled") },
    { label: "Posted", value: countByStatus(posts, "Posted") },
    { label: "Not posted", value: countByStatus(posts, "Not posted") },
  ];
}

export function getUpcomingPosts(posts: Post[], limit = 5): Post[] {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return posts
    .filter(
      (post) =>
        post.status !== "Posted" &&
        post.scheduled_date >= today,
    )
    .sort((a, b) => {
      const dateCompare = a.scheduled_date.localeCompare(b.scheduled_date);
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return comparePostTimes(a.scheduled_time, b.scheduled_time);
    })
    .slice(0, limit);
}
