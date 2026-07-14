import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Slot } from "@/features/posts-management/types/types";
import { postsToSlots } from "@/features/posts-management/utils/postsSlots";
import { fetchPostsForMonth } from "@/services/postsService";
import { resolveScopedProjectIds } from "@/services/projectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function usePostsQuery(year: number, month: number) {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async () => {
    const projectIds = await resolveScopedProjectIds(teamRole, teamMemberId);
    const posts = await fetchPostsForMonth(year, month, projectIds);
    return postsToSlots(posts, year, month);
  }, [year, month, teamRole, teamMemberId]);

  const { data: slots, isLoading, error, setError, reload } = useFetch(
    load,
    postsToSlots([], year, month),
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

  return { slots, isLoading, error, setError, reload, getSlot };
}

export type { Slot };
