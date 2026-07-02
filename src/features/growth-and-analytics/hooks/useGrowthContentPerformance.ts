import { useCallback, useMemo, useState } from "react";

import { fetchPastPostsForProfile } from "@/services/pastPostsMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import {
  buildContentStatCards,
  buildContentTypeSplit,
  buildEngagementByType,
  mapPostRows,
} from "../utils/contentMetrics";
import { mapPastPostToPostRow } from "../utils/instagramPostMetrics";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
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

  const posts = useMemo(
    () => pastPosts.map(mapPastPostToPostRow),
    [pastPosts],
  );

  const statCards = useMemo(() => buildContentStatCards(posts), [posts]);
  const typeSplit = useMemo(() => buildContentTypeSplit(posts), [posts]);
  const engagementByType = useMemo(() => buildEngagementByType(posts), [posts]);
  const postRows = useMemo(() => mapPostRows(posts), [posts]);

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
    isLoading: isAccountsLoading || isPostsLoading,
    error: accountsError || postsError,
    dateFilterProps,
    periodLabel,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  };
}
