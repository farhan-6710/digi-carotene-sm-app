import { useCallback, useEffect, useState } from "react";

import { getPostsAnalyticsMonthRange } from "@/features/analytics/utils/postsAnalyticsUtils";
import type { PublishingComparisonChart } from "@/features/team-portal/types/types";
import { buildPublishingComparisonChart } from "@/features/team-portal/utils/publishingComparisonUtils";
import { fetchPostedPostsForMonth } from "@/services/postsService";

export type PublishingMonthSelection = {
  year: number;
  month: number;
};

function defaultSelections(): {
  primary: PublishingMonthSelection;
  compare: PublishingMonthSelection;
} {
  const range = getPostsAnalyticsMonthRange();
  return {
    primary: { year: range.currentYear, month: range.currentMonth },
    compare: { year: range.previousYear, month: range.previousMonth },
  };
}

export function usePublishingComparisonChart() {
  const defaults = defaultSelections();
  const [primary, setPrimary] = useState<PublishingMonthSelection>(
    defaults.primary,
  );
  const [compare, setCompare] = useState<PublishingMonthSelection>(
    defaults.compare,
  );
  const [chart, setChart] = useState<PublishingComparisonChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [primaryPosts, comparePosts] = await Promise.all([
        fetchPostedPostsForMonth(primary.year, primary.month),
        fetchPostedPostsForMonth(compare.year, compare.month),
      ]);

      setChart(
        buildPublishingComparisonChart({
          currentYear: primary.year,
          currentMonth: primary.month,
          previousYear: compare.year,
          previousMonth: compare.month,
          currentMonthPosts: primaryPosts,
          previousMonthPosts: comparePosts,
        }),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load publishing comparison.",
      );
      setChart(null);
    } finally {
      setIsLoading(false);
    }
  }, [compare.month, compare.year, primary.month, primary.year]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  return {
    primary,
    compare,
    setPrimary,
    setCompare,
    chart,
    isLoading,
    error,
  };
}
