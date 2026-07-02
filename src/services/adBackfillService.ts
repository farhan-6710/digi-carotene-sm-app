import {
  mapCampaignStatus,
  parseConversions,
  parseSpend,
  getMetaInsightChunksForSpan,
} from "@/features/growth-and-analytics/utils/metaSyncMappers";
import { getAdBackfillMetaRange } from "@/features/growth-and-analytics/utils/adBackfillWindow";
import {
  fetchAdCampaignStatuses,
  fetchAdDailyInsights,
  type AdDailyInsight,
} from "@/services/metaService";
import {
  replaceAdCampaignMetricsForAccount,
  type AdCampaignMetricInsert,
} from "@/services/adCampaignMetricsService";

function mapInsightToInsert(
  insight: AdDailyInsight,
  statusByCampaignId: Map<string, string>,
): AdCampaignMetricInsert | null {
  const campaignId = insight.campaign_id?.trim();
  const metricDate = insight.date_start?.trim();
  if (!campaignId || !metricDate) return null;

  return {
    campaignId,
    campaignName: insight.campaign_name?.trim() || "Unnamed campaign",
    status: mapCampaignStatus(statusByCampaignId.get(campaignId)),
    metricDate,
    spend: parseSpend(insight.spend),
    impressions: Math.round(Number(insight.impressions ?? 0)),
    clicks: Math.round(Number(insight.clicks ?? 0)),
    conversions: parseConversions(insight.actions),
  };
}

export async function runAd29DayBackfill(
  adAccountId: string,
  metaAdAccountId: string,
  accessToken: string,
): Promise<number> {
  const range = getAdBackfillMetaRange();
  const campaigns = await fetchAdCampaignStatuses(metaAdAccountId, accessToken);
  const statusByCampaignId = new Map(
    campaigns.map((campaign) => [campaign.id, campaign.status ?? ""]),
  );

  const rows: AdCampaignMetricInsert[] = [];
  const chunks = getMetaInsightChunksForSpan(range.from, range.to);

  for (const chunk of chunks) {
    const insights = await fetchAdDailyInsights(metaAdAccountId, accessToken, chunk);
    for (const insight of insights) {
      const row = mapInsightToInsert(insight, statusByCampaignId);
      if (row) rows.push(row);
    }
  }

  await replaceAdCampaignMetricsForAccount(
    adAccountId,
    range.from,
    range.to,
    rows,
  );

  return rows.length;
}

export async function rerunAdBackfillForAccount(
  adAccountId: string,
  metaAdAccountId: string,
  accessToken: string,
): Promise<number> {
  return runAd29DayBackfill(adAccountId, metaAdAccountId, accessToken);
}
