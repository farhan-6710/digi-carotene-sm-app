import { useCallback, useMemo, useState } from "react";

import { fetchOrganicAccounts } from "@/services/growthAccountsService";
import { fetchLivePosts } from "@/services/growthLiveMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";
import { showToast } from "@/shared/utils/showToast";

import type { OrganicAccount, PostRow } from "../types/types";
import {
  buildContentStatCards,
  buildContentTypeSplit,
  buildEngagementByType,
  mapPostRows,
} from "../utils/contentMetrics";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
import { useGrowthAccountsUpdated } from "./useGrowthAccountsUpdated";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_ACCOUNTS: OrganicAccount[] = [];
const NO_POSTS: PostRow[] = [];

function platformLabel(account: OrganicAccount): string {
  return account.platform === "instagram" ? "Instagram" : "Facebook";
}

export function useGrowthContentPerformance() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const loadAccounts = useCallback(() => fetchOrganicAccounts(), []);
  const { data: accounts, reload: reloadAccounts } = useFetch<OrganicAccount[]>(
    loadAccounts,
    NO_ACCOUNTS,
  );

  useGrowthAccountsUpdated(reloadAccounts);

  const [selectedId, setSelectedId] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const activeAccount =
    accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const accountId = activeAccount?.id ?? "";

  const loadPosts = useCallback(
    () => (accountId ? fetchLivePosts(accountId, range) : Promise.resolve(NO_POSTS)),
    [accountId, range],
  );
  const { data: posts, isLoading, error, reload: reloadPosts } = useFetch<PostRow[]>(
    loadPosts,
    NO_POSTS,
  );

  useGrowthAccountsUpdated(async () => {
    await reloadAccounts();
    await reloadPosts();
  });

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: `${account.accountName} (${platformLabel(account)})`,
      })),
    [accounts],
  );

  const statCards = useMemo(() => buildContentStatCards(posts), [posts]);
  const typeSplit = useMemo(() => buildContentTypeSplit(posts), [posts]);
  const engagementByType = useMemo(() => buildEngagementByType(posts), [posts]);
  const postRows = useMemo(() => mapPostRows(posts), [posts]);

  const generateReport = useCallback(async () => {
    if (!activeAccount) {
      showToast("error", "Connect an organic account before generating a report.");
      return;
    }

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
  }, [activeAccount, range]);

  return {
    accountOptions,
    accountId,
    setAccountId: setSelectedId,
    statCards,
    typeSplit,
    engagementByType,
    postRows,
    isLoading,
    error,
    dateFilterProps,
    periodLabel,
    generateReport,
    isGeneratingReport,
    hasAccounts: accounts.length > 0,
  };
}
