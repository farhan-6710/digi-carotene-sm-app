import { format } from "date-fns";

import type { Post, StatusKey } from "@/features/posts-management/types/types";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";

export function getTodayPostDateString(now = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

export function buildDashboardPostLabel(post: Post): string {
  const projectName = post.project_name ?? "Unknown project";
  const postTitle = post.post_title?.trim();

  return postTitle ? `${projectName} - ${postTitle}` : projectName;
}

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

export function isPostOverdue(post: Post, now = new Date()): boolean {
  const dueAt = parseDateTime(post.to_be_posted_date, post.to_be_posted_time);
  return dueAt !== null && dueAt.getTime() <= now.getTime();
}

export function buildTodaysPostScheduleLabel(
  toBePostedTime: string,
  now = new Date(),
  dueAt: Date | null,
  postStatus: StatusKey,
): string {
  const timeLabel = toBePostedTime.trim() || "Time not set";

  if (postStatus === "Posted") {
    return `To be posted at ${timeLabel}`;
  }

  if (!dueAt || dueAt.getTime() > now.getTime()) {
    return `Due at ${timeLabel}`;
  }

  const delay = formatDelayDuration(now.getTime() - dueAt.getTime());
  return `Delayed ${delay} · was due ${timeLabel}`;
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

export function getPostDueTimestamp(post: Post): number {
  return (
    parseDateTime(post.to_be_posted_date, post.to_be_posted_time)?.getTime() ??
    Number.MAX_SAFE_INTEGER
  );
}
