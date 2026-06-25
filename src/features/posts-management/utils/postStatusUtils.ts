import { format } from "date-fns";

import type { StatusKey } from "@/features/posts-management/types/types";

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
  if (status !== "Posted") {
    return { postedDate: null, postedTime: null };
  }

  const posted = buildPostedNowFields();
  return {
    postedDate: posted.date,
    postedTime: posted.time,
  };
}
