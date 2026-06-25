import { useCallback, useEffect, useState } from "react";

import { fetchNotPostedPosts } from "@/features/posts-management/utils/postsRepository";
import type { TeamNeedsAttentionItem } from "@/features/team-portal/types/types";
import { mapNotPostedPostsToNeedsAttention } from "@/features/team-portal/utils/teamNeedsAttentionUtils";

const NEEDS_ATTENTION_LIMIT = 8;

export function useTeamNeedsAttentionQuery() {
  const [items, setItems] = useState<TeamNeedsAttentionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const posts = await fetchNotPostedPosts();
      setItems(mapNotPostedPostsToNeedsAttention(posts).slice(0, NEEDS_ATTENTION_LIMIT));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posts needing attention.",
      );
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  return { items, isLoading, error, reload };
}
