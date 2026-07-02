import { useCallback, useMemo } from "react";

import {
  fetchDailyFollowersForProfile,
  sumFollowersGained,
} from "@/services/instagramDailyFollowersService";
import { fetchPastPostsForProfile } from "@/services/pastPostsMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import { buildDashboardStatCards } from "../utils/dashboardMetrics";
import { buildContentTypeSplit } from "../utils/contentMetrics";
import {
  aggregatePostsToDailyRows,
  mapPastPostToPostRow,
  sumPostInteractionTotals,
} from "../utils/instagramPostMetrics";
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

  const profileId = activeInstagramProfile?.id ?? "";

  const loadPosts = useCallback(
    () =>
      profileId
        ? fetchPastPostsForProfile(profileId, range)
        : Promise.resolve([]),
    [profileId, range],
  );
  const {
    data: pastPosts,
    isLoading: isPostsLoading,
    error: postsError,
  } = useFetch(loadPosts, []);

  const loadFollowers = useCallback(
    () =>
      profileId
        ? fetchDailyFollowersForProfile(profileId, range)
        : Promise.resolve([]),
    [profileId, range],
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

  const postsDataRows = useMemo(
    () =>
      activeInstagramProfile
        ? aggregatePostsToDailyRows(pastPosts, activeInstagramProfile)
        : [],
    [pastPosts, activeInstagramProfile],
  );

  const interactionTotals = useMemo(
    () => sumPostInteractionTotals(pastPosts),
    [pastPosts],
  );

  const followersGained = useMemo(
    () => sumFollowersGained(dailyFollowers),
    [dailyFollowers],
  );

  const statCards = useMemo(
    () =>
      buildDashboardStatCards(
        postsDataRows,
        activeAccount,
        interactionTotals,
        followersGained,
      ),
    [postsDataRows, activeAccount, interactionTotals, followersGained],
  );

  const contentTypeSplit = useMemo(
    () => buildContentTypeSplit(posts),
    [posts],
  );

  return {
    statCards,
    postsDataRows,
    contentTypeSplit,
    isLoading: isAccountsLoading || isPostsLoading || isFollowersLoading,
    error: accountsError || postsError || followersError,
    dateFilterProps,
    periodLabel,
    hasAccounts,
  };
}
