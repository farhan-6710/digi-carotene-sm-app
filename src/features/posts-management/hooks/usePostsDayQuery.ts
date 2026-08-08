import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Post } from "@/features/posts-management/types/types";
import { fetchPostsForDate } from "@/services/postsService";
import { resolveScopedProjectIds } from "@/services/projectsService";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";
import { useFetch } from "@/shared/hooks/useFetch";

export function usePostsDayQuery(date: Date | null) {
  const { teamRole, teamMemberId } = useAuth();
  const dateKey = date ? serializeUrlDate(date) : "";

  const load = useCallback(async (): Promise<Post[]> => {
    if (!dateKey) {
      return [];
    }

    const projectIds = await resolveScopedProjectIds(teamRole, teamMemberId);
    return fetchPostsForDate(dateKey, projectIds);
  }, [dateKey, teamRole, teamMemberId]);

  return useFetch(load, []);
}
