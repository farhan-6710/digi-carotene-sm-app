import { useCallback, useEffect, useState } from "react";

import type { Post } from "@/features/posts-management/types/types";
import { fetchPostsForProjectId } from "@/features/posts-management/utils/postsRepository";
import type { TeamMember } from "@/features/team-management/types/types";
import { orderTeamMembersByIds } from "@/features/team-management/utils/teamMemberDisplayUtils";
import { fetchTeamMembersByIds } from "@/features/team-management/utils/teamMembersRepository";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchProjectById } from "@/features/projects-management/utils/projectsRepository";

export function useProjectDetailQuery(projectId: string) {
  const [project, setProject] = useState<ProjectListItem | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [teamMembers, setTeamMembers] = useState<
    Pick<TeamMember, "id" | "member_name">[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!projectId) {
      setProject(null);
      setPosts([]);
      setTeamMembers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectRow = await fetchProjectById(projectId);

      if (!projectRow) {
        setProject(null);
        setPosts([]);
        setTeamMembers([]);
        return;
      }

      const memberIds = projectRow.team_member_ids;
      const [postRows, memberRows] = await Promise.all([
        fetchPostsForProjectId(projectId),
        memberIds.length > 0
          ? fetchTeamMembersByIds(memberIds)
          : Promise.resolve([]),
      ]);

      setProject(projectRow);
      setPosts(postRows);
      setTeamMembers(orderTeamMembersByIds(memberRows, memberIds));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  return {
    project,
    posts,
    teamMembers,
    isLoading,
    error,
    reload,
  };
}
