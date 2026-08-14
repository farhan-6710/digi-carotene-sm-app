import { fetchClients } from "@/services/clientsService";
import { fetchTeamMembers } from "@/services/teamMembersService";
import {
  fetchAllPosts,
  fetchNotPostedPosts,
  fetchTodayPosts,
} from "@/services/postsService";
import type { Client } from "@/features/clients-management/types/types";
import type { TeamMember } from "@/features/team-management/types/types";
import type { Post } from "@/features/posts-management/types/types";

export type TeamDashboardPostsBundle = {
  clients: Client[];
  teamMembers: TeamMember[];
  todayPosts: Post[];
  notPostedPosts: Post[];
  posts: Post[];
};

export async function fetchTeamDashboardPostsBundle(): Promise<TeamDashboardPostsBundle> {
  const [clients, teamMembers, todayPosts, notPostedPosts, posts] =
    await Promise.all([
      fetchClients(),
      fetchTeamMembers(),
      fetchTodayPosts(),
      fetchNotPostedPosts(),
      fetchAllPosts(),
    ]);

  return {
    clients,
    teamMembers,
    todayPosts,
    notPostedPosts,
    posts,
  };
}
