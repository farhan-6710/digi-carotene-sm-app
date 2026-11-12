import { useCallback } from "react";

import {
  fetchOrganicAccessToken,
} from "@/services/growthAccountsService";
import {
  fetchFacebookDashboardInsights,
  fetchFacebookPageAccessToken,
  fetchFacebookPosts,
} from "@/services/metaService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { GrowthDateRange, OrganicAccount } from "../types/types";
import {
  buildFacebookOrganicAnalytics,
  type FacebookOrganicAnalytics,
} from "../utils/facebookOrganicMetrics";
import {
  getMetaInsightChunksForSpan,
  resolveGrowthMetaSpan,
} from "../utils/metaSyncMappers";

const EMPTY: FacebookOrganicAnalytics = {
  dailyRows: [],
  posts: [],
  contentRows: [],
  interactionTotals: {
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    reposts: 0,
    views: 0,
  },
  pageImpressions: 0,
  pageEngagements: 0,
  fanAdds: 0,
};

export function useFacebookOrganicAnalytics(
  account: OrganicAccount | undefined,
  range: GrowthDateRange,
) {
  const accountId = account?.id ?? "";
  const pageId = account?.accountId ?? "";
  const enabled = Boolean(account && account.platform === "facebook" && pageId);

  const load = useCallback(async (): Promise<FacebookOrganicAnalytics> => {
    if (!enabled || !account) return EMPTY;

    const token = await fetchOrganicAccessToken(accountId);
    const pageToken = await fetchFacebookPageAccessToken(pageId, token);
    const span = resolveGrowthMetaSpan(range);
    const chunks = getMetaInsightChunksForSpan(span.from, span.to);

    const insightBatches = await Promise.all(
      chunks.map((chunk) =>
        fetchFacebookDashboardInsights(pageId, pageToken, chunk),
      ),
    );
    const insights = insightBatches.flat();
    const fbPosts = await fetchFacebookPosts(pageId, pageToken);

    return buildFacebookOrganicAnalytics({
      account,
      range: { from: span.from, to: span.to },
      insights,
      fbPosts,
    });
  }, [account, accountId, enabled, pageId, range]);

  const { data, isLoading, error } = useFetch(
    load,
    EMPTY,
  );

  return {
    analytics: enabled ? data : EMPTY,
    isLoading: enabled ? isLoading : false,
    error: enabled ? error : null,
  };
}
