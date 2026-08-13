import { subMonths } from "date-fns";

import type { PostsTopClient } from "@/features/analytics/types/types";
import type { Post } from "@/features/posts-management/types/types";

export function buildPostsTopClients(
  posts: Post[],
  limit = 10,
): PostsTopClient[] {
  const counts = new Map<
    string,
    { posts: number; posted: number; backlogs: number }
  >();

  for (const post of posts) {
    const clientName = post.client_name ?? "Unknown client";
    const entry = counts.get(clientName) ?? {
      posts: 0,
      posted: 0,
      backlogs: 0,
    };

    entry.posts += 1;
    if (post.status === "Posted") {
      entry.posted += 1;
    } else {
      entry.backlogs += 1;
    }

    counts.set(clientName, entry);
  }

  return [...counts.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.posts - a.posts || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function getPostsAnalyticsMonthRange(referenceDate = new Date()) {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1;
  const previous = subMonths(referenceDate, 1);

  return {
    currentYear,
    currentMonth,
    previousYear: previous.getFullYear(),
    previousMonth: previous.getMonth() + 1,
  };
}
