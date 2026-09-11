import { useCallback, useMemo } from "react";

import {
  fetchDailyFollowersForProfile,
  sumFollowersGained,
} from "@/services/instagramDailyFollowersService";
import { fetchPastPostsForProfile } from "@/services/pastPostsMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import { buildDashboardStatCards } from "../utils/dashboardMetrics";
import { buildContentTypeSplit } from "../utils/contentMetrics";
import { buildFacebookDashboardStatCards } from "../utils/facebookOrganicMetrics";
import {
  aggregatePostsToDailyRows,
  mapPastPostToPostRow,
  sumPostInteractionTotals,
} from "../utils/instagramPostMetrics";
import { useFacebookOrganicAnalytics } from "./useFacebookOrganicAnalytics";
import { useGrowthDateRange } from "./useGrowthDateRange";
import { useGrowthOrganicAccountPicker } from "./useGrowthOrganicAccountPicker";

export function useGrowthDashboard() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const {
    activeAccount,
    activeInstagramProfile,
    isAccountsLoading,
    accountsError,
    hasAccounts,
  } = useGrowthOrganicAccountPicker();

  const isFacebook = activeAccount?.platform === "facebook";
  const profileId = activeInstagramProfile?.id ?? "";

  const {
    analytics: facebookAnalytics,
    isLoading: isFacebookLoading,
    error: facebookError,
  } = useFacebookOrganicAnalytics(activeAccount, range);

  const loadPosts = useCallback(
    () =>
      !isFacebook && profileId
        ? fetchPastPostsForProfile(profileId, range)
        : Promise.resolve([]),
    [isFacebook, profileId, range],
  );
  const {
    data: pastPosts,
    isLoading: isPostsLoading,
    error: postsError,
  } = useFetch(loadPosts, []);

  const loadFollowers = useCallback(
    () =>
      !isFacebook && profileId
        ? fetchDailyFollowersForProfile(profileId, range)
        : Promise.resolve([]),
    [isFacebook, profileId, range],
  );
  const {
    data: dailyFollowers,
    isLoading: isFollowersLoading,
    error: followersError,
  } = useFetch(loadFollowers, []);

  const posts = useMemo(
    () => pastPosts.map(mapPastPostToPostRow),
    [pastPosts],
  );

  const postsDataRows = useMemo(() => {
    if (isFacebook) return facebookAnalytics.dailyRows;
    return activeInstagramProfile
      ? aggregatePostsToDailyRows(pastPosts, activeInstagramProfile)
      : [];
  }, [
    activeInstagramProfile,
    facebookAnalytics.dailyRows,
    isFacebook,
    pastPosts,
  ]);

  const interactionTotals = useMemo(
    () =>
      isFacebook
        ? facebookAnalytics.interactionTotals
        : sumPostInteractionTotals(pastPosts),
    [facebookAnalytics.interactionTotals, isFacebook, pastPosts],
  );

  const followersGained = useMemo(
    () =>
      isFacebook
        ? facebookAnalytics.fanAdds
        : sumFollowersGained(dailyFollowers),
    [dailyFollowers, facebookAnalytics.fanAdds, isFacebook],
  );

  const statCards = useMemo(() => {
    if (isFacebook && activeAccount) {
      return buildFacebookDashboardStatCards(activeAccount, facebookAnalytics);
    }
    return buildDashboardStatCards(
      postsDataRows,
      activeAccount,
      interactionTotals,
      followersGained,
    );
  }, [
    activeAccount,
    facebookAnalytics,
    followersGained,
    interactionTotals,
    isFacebook,
    postsDataRows,
  ]);

  const contentTypeSplit = useMemo(() => {
    if (isFacebook) {
      const count = facebookAnalytics.posts.length;
      if (count === 0) return [];
      return [
        {
          key: "post",
          label: "Posts",
          value: count,
          color: "var(--chart-3)",
        },
      ];
    }
    return buildContentTypeSplit(posts);
  }, [facebookAnalytics.posts.length, isFacebook, posts]);

  return {
    statCards,
    postsDataRows,
    contentTypeSplit,
    isFacebook,
    isLoading:
      isAccountsLoading ||
      (isFacebook
        ? isFacebookLoading
        : isPostsLoading || isFollowersLoading),
    error: accountsError || facebookError || postsError || followersError,
    dateFilterProps,
    periodLabel,
    hasAccounts,
  };
}
