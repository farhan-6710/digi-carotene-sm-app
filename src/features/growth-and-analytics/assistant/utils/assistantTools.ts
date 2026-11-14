/**
 * Runs Pulse tool calls in the browser with the signed-in user's Supabase session.
 * Declarations live in supabase/functions/assistant/assistantTools.ts.
 */
import { GROWTH_AD_ACCOUNT_PARAM } from "../../constants/shared/growthUrlParams";
import {
  aggregateMetricRows,
  filterByDateRange,
} from "./aggregateMetrics";
import {
  fetchAdCampaignMetricsByCampaignId,
  fetchAdCampaignMetricsForAccount,
} from "@/services/adCampaignMetricsService";
import { fetchAdMetricsByAdId } from "@/services/adMetricsService";
import { fetchAdsByAdset } from "@/services/adsService";
import { fetchAdsetMetricsByAdsetId } from "@/services/adsetMetricsService";
import { fetchAdsetsByCampaign } from "@/services/adsetsService";
import {
  fetchActiveBenchmark,
  fetchCampaignKpiConfig,
} from "@/services/campaignLearningService";
import type {
  AssistantToolArgs,
  AssistantToolResult,
} from "@/shared/types/assistant";

const MAX_RESULTS = 12;

type ToolContext = { basePath: string };

type Tool = (
  _userId: string,
  args: AssistantToolArgs,
  ctx: ToolContext,
) => Promise<AssistantToolResult>;

function text(args: AssistantToolArgs, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function matches(haystack: string, query: string | undefined): boolean {
  if (!query) return true;
  const lower = haystack.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => lower.includes(word));
}

function withAccountParam(path: string, adAccountId: string): string {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}

const listCampaigns: Tool = async (_userId, args, ctx) => {
  const adAccountId = text(args, "ad_account_id");
  if (!adAccountId) return { error: "ad_account_id is required." };
  const query = text(args, "query");
  const from = text(args, "from");
  const to = text(args, "to");
  const rows = filterByDateRange(
    await fetchAdCampaignMetricsForAccount(adAccountId, { from, to }),
    from,
    to,
  );

  const byCampaign = new Map<
    string,
    { name: string; status: string; objective: string | null; rows: typeof rows }
  >();
  for (const row of rows) {
    const current = byCampaign.get(row.campaignId) ?? {
      name: row.campaignName,
      status: row.status,
      objective: row.objective,
      rows: [] as typeof rows,
    };
    current.rows.push(row);
    byCampaign.set(row.campaignId, current);
  }

  const campaigns = [...byCampaign.entries()]
    .filter(([, value]) => matches(value.name, query))
    .map(([campaignId, value]) => ({
      campaignId,
      name: value.name,
      status: value.status,
      objective: value.objective,
      ...aggregateMetricRows(value.rows),
      link: withAccountParam(
        `${ctx.basePath}/campaigns/${campaignId}`,
        adAccountId,
      ),
      learningLink: withAccountParam(
        `${ctx.basePath}/campaigns/${campaignId}/learning`,
        adAccountId,
      ),
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, MAX_RESULTS);

  return { campaigns, total: byCampaign.size };
};

const getCampaignPerformance: Tool = async (_userId, args, ctx) => {
  const adAccountId = text(args, "ad_account_id");
  const campaignId = text(args, "campaign_id");
  if (!adAccountId || !campaignId) {
    return { error: "ad_account_id and campaign_id are required." };
  }
  const from = text(args, "from");
  const to = text(args, "to");
  const rows = filterByDateRange(
    await fetchAdCampaignMetricsByCampaignId(adAccountId, campaignId),
    from,
    to,
  );
  if (!rows.length) {
    return {
      campaignId,
      totals: null,
      message: "No synced daily metrics for this campaign in that range.",
    };
  }
  const sample = rows[0];
  return {
    campaignId,
    name: sample.campaignName,
    status: sample.status,
    objective: sample.objective,
    from: from ?? null,
    to: to ?? null,
    totals: aggregateMetricRows(rows),
    recentDays: rows.slice(0, 7).map((row) => ({
      date: row.date,
      spend: row.spend,
      clicks: row.clicks,
      conversions: row.conversions,
    })),
    link: withAccountParam(
      `${ctx.basePath}/campaigns/${campaignId}`,
      adAccountId,
    ),
  };
};

const listAdsets: Tool = async (_userId, args, ctx) => {
  const adAccountId = text(args, "ad_account_id");
  const campaignId = text(args, "campaign_id");
  if (!adAccountId || !campaignId) {
    return { error: "ad_account_id and campaign_id are required." };
  }
  const adsets = await fetchAdsetsByCampaign(adAccountId, campaignId);
  return {
    adsets: adsets.slice(0, MAX_RESULTS).map((adset) => ({
      adsetId: adset.adsetId,
      name: adset.adsetName,
      status: adset.status,
      link: withAccountParam(
        `${ctx.basePath}/campaigns/${campaignId}/adsets/${adset.adsetId}`,
        adAccountId,
      ),
    })),
    total: adsets.length,
  };
};

const getAdsetPerformance: Tool = async (_userId, args) => {
  const adAccountId = text(args, "ad_account_id");
  const adsetId = text(args, "adset_id");
  if (!adAccountId || !adsetId) {
    return { error: "ad_account_id and adset_id are required." };
  }
  const from = text(args, "from");
  const to = text(args, "to");
  const rows = filterByDateRange(
    await fetchAdsetMetricsByAdsetId(adAccountId, adsetId),
    from,
    to,
  );
  if (!rows.length) {
    return {
      adsetId,
      totals: null,
      message: "No synced daily metrics for this ad set in that range.",
    };
  }
  const sample = rows[0];
  return {
    adsetId,
    name: sample.adsetName,
    campaignId: sample.campaignId,
    from: from ?? null,
    to: to ?? null,
    totals: aggregateMetricRows(rows),
    recentDays: rows.slice(0, 7).map((row) => ({
      date: row.date,
      spend: row.spend,
      clicks: row.clicks,
      conversions: row.conversions,
    })),
  };
};

const listAds: Tool = async (_userId, args) => {
  const adAccountId = text(args, "ad_account_id");
  const adsetId = text(args, "adset_id");
  if (!adAccountId || !adsetId) {
    return { error: "ad_account_id and adset_id are required." };
  }
  const ads = await fetchAdsByAdset(adAccountId, adsetId);
  return {
    ads: ads.slice(0, MAX_RESULTS).map((ad) => ({
      adId: ad.adId,
      name: ad.adName,
      status: ad.status,
      campaignId: ad.campaignId,
    })),
    total: ads.length,
  };
};

const getAdPerformance: Tool = async (_userId, args) => {
  const adAccountId = text(args, "ad_account_id");
  const adId = text(args, "ad_id");
  if (!adAccountId || !adId) {
    return { error: "ad_account_id and ad_id are required." };
  }
  const from = text(args, "from");
  const to = text(args, "to");
  const rows = filterByDateRange(
    await fetchAdMetricsByAdId(adAccountId, adId),
    from,
    to,
  );
  if (!rows.length) {
    return {
      adId,
      totals: null,
      message: "No synced daily metrics for this ad in that range.",
    };
  }
  const sample = rows[0];
  return {
    adId,
    name: sample.adName,
    campaignId: sample.campaignId,
    adsetId: sample.adsetId,
    from: from ?? null,
    to: to ?? null,
    totals: aggregateMetricRows(rows),
    recentDays: rows.slice(0, 7).map((row) => ({
      date: row.date,
      spend: row.spend,
      clicks: row.clicks,
      conversions: row.conversions,
    })),
  };
};

const getCampaignBenchmark: Tool = async (_userId, args, ctx) => {
  const adAccountId = text(args, "ad_account_id");
  const campaignId = text(args, "campaign_id");
  if (!adAccountId || !campaignId) {
    return { error: "ad_account_id and campaign_id are required." };
  }
  const [benchmark, kpiConfig] = await Promise.all([
    fetchActiveBenchmark(adAccountId, campaignId),
    fetchCampaignKpiConfig(adAccountId, campaignId),
  ]);
  return {
    campaignId,
    benchmark: benchmark
      ? {
          mode: benchmark.mode,
          status: benchmark.status,
          values: benchmark.values,
          bestWindows: benchmark.bestWindows,
          reason: benchmark.reason,
          createdAt: benchmark.createdAt,
        }
      : null,
    kpiConfig: kpiConfig
      ? {
          primaryKpi: kpiConfig.primaryKpi,
          secondaryKpis: kpiConfig.secondaryKpis,
        }
      : null,
    learningLink: withAccountParam(
      `${ctx.basePath}/campaigns/${campaignId}/learning`,
      adAccountId,
    ),
  };
};

const TOOLS: Record<string, Tool> = {
  list_campaigns: listCampaigns,
  get_campaign_performance: getCampaignPerformance,
  list_adsets: listAdsets,
  get_adset_performance: getAdsetPerformance,
  list_ads: listAds,
  get_ad_performance: getAdPerformance,
  get_campaign_benchmark: getCampaignBenchmark,
};

export async function runAssistantTool(
  userId: string,
  name: string,
  args: AssistantToolArgs | undefined,
  basePath: string,
): Promise<AssistantToolResult> {
  const tool = TOOLS[name];
  if (!tool) return { error: `Unknown tool: ${name}` };
  try {
    return await tool(userId, args ?? {}, { basePath });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Tool failed.",
    };
  }
}
