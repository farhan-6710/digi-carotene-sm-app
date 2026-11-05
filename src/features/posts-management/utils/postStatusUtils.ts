import { format } from "date-fns";

import type { StatusKey } from "@/features/posts-management/types/types";

export function isPostedStatus(status: StatusKey): boolean {
  return status === "posted";
}

export function buildPostedNowFields(now = new Date()): {
  date: string;
  time: string;
} {
  return {
    date: format(now, "yyyy-MM-dd"),
    time: format(now, "h:mm a"),
  };
}

export function getPostStatusUpdateFields(status: StatusKey): {
  postedDate: string | null;
  postedTime: string | null;
} {
  if (!isPostedStatus(status)) {
    return { postedDate: null, postedTime: null };
  }

  const posted = buildPostedNowFields();
  return {
    postedDate: posted.date,
    postedTime: posted.time,
  };
}
