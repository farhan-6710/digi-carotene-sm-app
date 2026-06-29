import { useCallback, useMemo, useState } from "react";

import { fetchOrganicAccounts } from "@/services/growthAccountsService";
import { fetchPosts } from "@/services/growthAnalyticsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { OrganicAccount, PostRow } from "../types/types";
import {
  buildContentStatCards,
  buildContentTypeSplit,
  buildEngagementByType,
  mapPostRows,
} from "../utils/contentMetrics";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_ACCOUNTS: OrganicAccount[] = [];
const NO_POSTS: PostRow[] = [];

function platformLabel(account: OrganicAccount): string {
  return account.platform === "instagram" ? "Instagram" : "Facebook";
}

export function useGrowthContentPerformance() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const loadAccounts = useCallback(() => fetchOrganicAccounts(), []);
  const { data: accounts } = useFetch<OrganicAccount[]>(loadAccounts, NO_ACCOUNTS);

  const [selectedId, setSelectedId] = useState("");
  const accountId = selectedId || accounts[0]?.id || "";

  const loadPosts = useCallback(
    () => (accountId ? fetchPosts(accountId, range) : Promise.resolve(NO_POSTS)),
    [accountId, range],
  );
  const { data: posts, isLoading, error } = useFetch<PostRow[]>(loadPosts, NO_POSTS);

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
  };
}
