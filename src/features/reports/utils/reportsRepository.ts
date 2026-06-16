import { format } from "date-fns";

import { supabase } from "@/shared/lib/supabase";
import type { Post, StatusKey } from "@/features/posts-management/types/types";

export function formatReportDateRangeLabel(
  from: Date | undefined,
  to: Date | undefined,
): string {
  if (!from) {
    return "Select date range";
  }

  if (!to) {
    return format(from, "MMM d, yyyy");
  }

  if (format(from, "yyyy-MM-dd") === format(to, "yyyy-MM-dd")) {
    return format(from, "MMM d, yyyy");
  }

  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
}

export async function fetchPostsForDateRange(
  startDate: string,
  endDate: string,
  statuses?: StatusKey[],
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*")
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as Post[];
}

export function toReportDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
