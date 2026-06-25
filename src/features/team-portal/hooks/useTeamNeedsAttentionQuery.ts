import { useCallback, useEffect, useState } from "react";

import { fetchNotPostedPosts } from "@/features/posts-management/utils/postsRepository";
import { TEAM_NEEDS_ATTENTION_LIMIT } from "@/features/team-portal/constants/teamDashboardPosts";
import type { TeamNeedsAttentionItem } from "@/features/team-portal/types/types";
import { mapNotPostedPostsToNeedsAttention } from "@/features/team-portal/utils/teamNeedsAttentionUtils";

export function useTeamNeedsAttentionQuery() {
  const [items, setItems] = useState<TeamNeedsAttentionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const posts = await fetchNotPostedPosts();
      setItems(
        mapNotPostedPostsToNeedsAttention(posts).slice(0, TEAM_NEEDS_ATTENTION_LIMIT),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posts needing attention.",
      );
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback((postId: string) => {
    setItems((current) => current.filter((item) => item.id !== postId));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  return { items, isLoading, error, reload, removeItem };
}
