import { useCallback, useEffect, useState } from "react";

import type { PostsTopClient } from "@/features/analytics/types/types";
import { buildPostsAnalyticsStatCards } from "@/features/analytics/utils/analyticsStatsUtils";
import {
  buildPostsTopClients,
  getPostsAnalyticsMonthRange,
} from "@/features/analytics/utils/postsAnalyticsUtils";
import { fetchPostsForMonth } from "@/features/posts-management/utils/postsRepository";
import type { StatCardItem } from "@/shared/types/statsCards";

export function usePostsAnalyticsQuery() {
  const [stats, setStats] = useState<StatCardItem[]>([]);
  const [topClients, setTopClients] = useState<PostsTopClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { currentYear, currentMonth, previousYear, previousMonth } =
      getPostsAnalyticsMonthRange();

    try {
      const [currentPosts, previousPosts] = await Promise.all([
        fetchPostsForMonth(currentYear, currentMonth),
        fetchPostsForMonth(previousYear, previousMonth),
      ]);

      setStats(buildPostsAnalyticsStatCards(currentPosts, previousPosts));
      setTopClients(buildPostsTopClients(currentPosts));
    } catch (err) {
      setStats([]);
      setTopClients([]);
      setError(
        err instanceof Error ? err.message : "Failed to load posts analytics.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  return { stats, topClients, isLoading, error, reload };
}
