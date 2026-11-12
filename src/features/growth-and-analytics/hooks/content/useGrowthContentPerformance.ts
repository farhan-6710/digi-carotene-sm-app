import { useCallback, useMemo, useState } from "react";

import { fetchPastPostsForProfile } from "@/services/pastPostsMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import {
  buildContentStatCards,
  buildContentTypeSplit,
  buildEngagementByType,
  mapPostRows,
} from "../utils/contentMetrics";
import {
  buildFacebookContentStatCards,
  buildFacebookContentTypeSplit,
  buildFacebookEngagementByType,
} from "../utils/facebookOrganicMetrics";
import { mapPastPostToPostRow } from "../utils/instagramPostMetrics";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
import { useFacebookOrganicAnalytics } from "./useFacebookOrganicAnalytics";
import { useGrowthDateRange } from "./useGrowthDateRange";
import { useGrowthOrganicAccountPicker } from "./useGrowthOrganicAccountPicker";

export function useGrowthContentPerformance() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const {
    activeAccount,
    activeInstagramProfile,
    isAccountsLoading,
    accountsError,
    hasAccounts,
  } = useGrowthOrganicAccountPicker();

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
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

  const posts = useMemo(
    () => pastPosts.map(mapPastPostToPostRow),
    [pastPosts],
  );

  const statCards = useMemo(
    () =>
      isFacebook
        ? buildFacebookContentStatCards(facebookAnalytics.posts)
        : buildContentStatCards(posts),
    [facebookAnalytics.posts, isFacebook, posts],
  );
  const typeSplit = useMemo(
    () =>
      isFacebook
        ? buildFacebookContentTypeSplit(facebookAnalytics.posts)
        : buildContentTypeSplit(posts),
    [facebookAnalytics.posts, isFacebook, posts],
  );
  const engagementByType = useMemo(
    () =>
      isFacebook
        ? buildFacebookEngagementByType(facebookAnalytics.posts)
        : buildEngagementByType(posts),
    [facebookAnalytics.posts, isFacebook, posts],
  );
  const postRows = useMemo(
    () =>
      isFacebook ? facebookAnalytics.contentRows : mapPostRows(posts),
    [facebookAnalytics.contentRows, isFacebook, posts],
  );

  const generateReport = async () => {
    if (!activeAccount) return;

    const { periodStart, periodEnd } = resolveGrowthReportPeriod(range);
    setIsGeneratingReport(true);
    try {
      await saveGrowthReport({
        title: `${activeAccount.accountName} — Content Performance`,
        type: "content_performance",
        platform: activeAccount.platform,
        periodStart,
        periodEnd,
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return {
    statCards,
    typeSplit,
    engagementByType,
    postRows,
    isFacebook,
    isLoading:
      isAccountsLoading || (isFacebook ? isFacebookLoading : isPostsLoading),
    error: accountsError || facebookError || postsError,
    dateFilterProps,
    periodLabel,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  };
}
