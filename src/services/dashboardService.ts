import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import {
  fetchAllPosts,
  fetchNotPostedPosts,
  fetchTodayPosts,
} from "@/services/postsService";

export type TeamDashboardCounts = {
  clientsCount: number;
  teamMembersCount: number;
  totalPostsCount: number;
  notPostedPostsCount: number;
};

async function countRows(
  table: string,
  filter?: { column: string; value: string | boolean },
): Promise<number> {
  let query = supabase.from(table).select("id", { count: "exact", head: true });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function fetchTeamDashboardCounts(): Promise<TeamDashboardCounts> {
  const [clientsCount, teamMembersCount, totalPostsCount, notPostedPostsCount] =
    await Promise.all([
      countRows(DB.CLIENTS.TABLE, { column: "is_active", value: true }),
      countRows(DB.TEAM_MEMBERS.TABLE),
      countRows(DB.POSTS.TABLE),
      countRows(DB.POSTS.TABLE, { column: "status", value: "Not posted" }),
    ]);

  return { clientsCount, teamMembersCount, totalPostsCount, notPostedPostsCount };
}

// Loads everything the team dashboard needs in one parallel batch.
export async function fetchTeamDashboardPostsBundle() {
  const [counts, todayPosts, notPostedPosts, posts] = await Promise.all([
    fetchTeamDashboardCounts(),
    fetchTodayPosts(),
    fetchNotPostedPosts(),
    fetchAllPosts(),
  ]);

  return {
    counts,
    todayPosts,
    notPostedPosts,
    posts,
  };
}
