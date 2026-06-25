import { format } from "date-fns";

import type { Post } from "@/features/posts-management/types/types";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import type { TeamNeedsAttentionItem } from "@/features/team-portal/types/types";

function formatDelayDuration(diffMs: number): string {
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  const remainingMinutes = diffMinutes % 60;

  if (diffDays > 0) {
    return remainingHours > 0 ? `${diffDays}d ${remainingHours}h` : `${diffDays}d`;
  }

  if (diffHours > 0) {
    return remainingMinutes > 0 ? `${diffHours}h ${remainingMinutes}m` : `${diffHours}h`;
  }

  return `${diffMinutes}m`;
}

export function buildNeedsAttentionScheduleLabel(
  toBePostedDate: string,
  toBePostedTime: string,
  now = new Date(),
): string {
  const dueAt = parseDateTime(toBePostedDate, toBePostedTime);
  const dueLabel = dueAt
    ? format(dueAt, "MMM d · h:mm a")
    : `${toBePostedDate} · ${toBePostedTime}`;

  if (!dueAt || dueAt.getTime() > now.getTime()) {
    return `To be posted on ${dueLabel}`;
  }

  const delay = formatDelayDuration(now.getTime() - dueAt.getTime());
  return `Delayed ${delay} · was due ${dueLabel}`;
}

export function buildNeedsAttentionLabel(post: Post): string {
  const projectName = post.project_name ?? "Unknown project";
  const postTitle = post.post_title?.trim();

  return postTitle ? `${projectName} - ${postTitle}` : projectName;
}

export function mapNotPostedPostsToNeedsAttention(
  posts: Post[],
): TeamNeedsAttentionItem[] {
  const now = new Date();

  return posts
    .map((post) => {
      const isOverdue = isPostOverdue(post, now);
      return {
        item: {
          id: post.id,
          label: buildNeedsAttentionLabel(post),
          status: "Not posted" as const,
          scheduleLabel: buildNeedsAttentionScheduleLabel(
            post.to_be_posted_date,
            post.to_be_posted_time,
            now,
          ),
          isOverdue,
        },
        dueAt:
          parseDateTime(post.to_be_posted_date, post.to_be_posted_time)?.getTime() ??
          Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => {
      const aOverdue = a.item.isOverdue;
      const bOverdue = b.item.isOverdue;

      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1;
      }

      return a.dueAt - b.dueAt;
    })
    .map(({ item }) => item);
}

function isPostOverdue(post: Post, now = new Date()): boolean {
  const dueAt = parseDateTime(post.to_be_posted_date, post.to_be_posted_time);
  return dueAt !== null && dueAt.getTime() <= now.getTime();
}
