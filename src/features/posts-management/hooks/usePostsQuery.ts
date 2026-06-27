import { useCallback, useEffect, useState } from "react";

import type { Slot } from "@/features/posts-management/types/types";
import { fetchPostsForMonth } from "@/services/postsService";
import { postsToSlots } from "@/features/posts-management/utils/postsSlots";

export function usePostsQuery(year: number, month: number) {
  const [slots, setSlots] = useState(() => postsToSlots([], year, month));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const posts = await fetchPostsForMonth(year, month);
      setSlots(postsToSlots(posts, year, month));
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load posts for this month.";
      setError(message);
      setSlots(postsToSlots([], year, month));
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    void reload();
  }, [reload]);

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
