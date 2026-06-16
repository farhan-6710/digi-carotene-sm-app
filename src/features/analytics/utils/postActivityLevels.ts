import type { PostActivityLevel } from "@/features/analytics/types/types";

export const postActivityLevelClasses: Record<PostActivityLevel, string> = {
  0: "bg-status-muted",
  1: "bg-contrib-1",
  2: "bg-contrib-2",
  3: "bg-contrib-3",
  4: "bg-contrib-4",
};

export function getPostActivityLevel(publishedCount: number): PostActivityLevel {
  if (publishedCount <= 0) {
    return 0;
  }

  if (publishedCount <= 2) {
    return 1;
  }

  if (publishedCount <= 4) {
    return 2;
  }

  if (publishedCount <= 6) {
    return 3;
  }

  return 4;
}

export function formatPostActivityDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
