import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";

export function isPassedPostingTime(
  dateStr: string,
  timeStr: string,
  now = new Date(),
): boolean {
  const postingAt = parseDateTime(dateStr, timeStr);
  if (!postingAt) {
    return false;
  }

  return postingAt.getTime() < now.getTime();
}
