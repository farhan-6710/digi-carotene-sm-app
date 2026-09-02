import type { TaskPriority } from "@/features/tasks-management/types/types";

/** High-priority open work included in the midnight task digest email. */
export const TASK_DIGEST_PRIORITY: TaskPriority = "high";

export const TASK_DIGEST_OPEN_STATUSES = ["pending", "in_progress"] as const;

/** Top items listed in the digest email body (tasks + subtasks combined). */
export const TASK_DIGEST_EMAIL_TOP_COUNT = 3;

/**
 * Agency timezone for the midnight cron window.
 * Keep in sync with scripts/php/lib/taskDigest.php and post digest.
 */
export const TASK_DIGEST_TIMEZONE = "Asia/Kolkata";

/** Priority rank — keep in sync with dashboard needs-attention sort. */
export const TASK_WORK_PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};
