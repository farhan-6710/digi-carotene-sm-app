import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Post } from "@/features/posts-management/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchPostsForDate } from "@/services/postsService";
import { fetchProjectsScoped, resolveScopedProjectIds } from "@/services/projectsService";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";
import { useFetch } from "@/shared/hooks/useFetch";

type PostsDayBundle = {
  posts: Post[];
  projects: ProjectListItem[];
};

export function usePostsDayQuery(date: Date | null) {
  const { teamRole, teamMemberId } = useAuth();
  const dateKey = date ? serializeUrlDate(date) : "";

  const load = useCallback(async (): Promise<PostsDayBundle> => {
    if (!dateKey) {
      return { posts: [], projects: [] };
    }

    const projectIds = await resolveScopedProjectIds(teamRole, teamMemberId);
    const [posts, projects] = await Promise.all([
      fetchPostsForDate(dateKey, projectIds),
      fetchProjectsScoped(teamRole, teamMemberId),
    ]);

    return { posts, projects };
  }, [dateKey, teamRole, teamMemberId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, {
    posts: [],
    projects: [],
  } as PostsDayBundle);

  return {
    posts: data.posts,
    projects: data.projects,
    isLoading,
    error,
    setError,
    reload,
  };
}
