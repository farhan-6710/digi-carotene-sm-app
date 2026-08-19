import { useCallback, useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Slot } from "@/features/posts-management/types/types";
import { postsToSlots } from "@/features/posts-management/utils/postsSlots";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchPostsForMonth } from "@/services/postsService";
import { fetchProjectsScoped, resolveScopedProjectIds } from "@/services/projectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function usePostsQuery(year: number, month: number) {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async () => {
    const projectIds = await resolveScopedProjectIds(teamRole, teamMemberId);
    const [posts, projects] = await Promise.all([
      fetchPostsForMonth(year, month, projectIds),
      fetchProjectsScoped(teamRole, teamMemberId),
    ]);

    return { posts, projects };
  }, [year, month, teamRole, teamMemberId]);

  const {
    data,
    isLoading,
    error,
    setError,
    reload,
  } = useFetch<{ posts: import("@/features/posts-management/types/types").Post[]; projects: ProjectListItem[] }>(
    load,
    { posts: [], projects: [] },
  );

  const slots = useMemo(
    () => postsToSlots(data.posts, year, month),
    [data.posts, year, month],
  );

  const getSlot = useCallback(
    (slotYear: number, slotMonth: number, date: number) =>
      slots.find(
        (slot) =>
          slot.year === slotYear &&
          slot.month === slotMonth &&
          slot.date === date,
      ),
    [slots],
  );

  return {
    posts: data.posts,
    projects: data.projects,
    slots,
    isLoading,
    error,
    setError,
    reload,
    getSlot,
  };
}

export type { Slot };
