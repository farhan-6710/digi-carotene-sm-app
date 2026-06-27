import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import { mapPostRow, type PostRow } from "@/services/postsService";
import type { Post, StatusKey } from "@/features/posts-management/types/types";

export async function fetchPostsForDateRange(
  startDate: string,
  endDate: string,
  statuses?: StatusKey[] | null,
): Promise<Post[]> {
  // An explicit empty list means "no statuses selected", so return nothing.
  if (Array.isArray(statuses) && statuses.length === 0) {
    return [];
  }

  let query = supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .gte("to_be_posted_date", startDate)
    .lte("to_be_posted_date", endDate)
    .order("to_be_posted_date", { ascending: true })
    .order("to_be_posted_time", { ascending: true });

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapPostRow(row as unknown as PostRow));
}
