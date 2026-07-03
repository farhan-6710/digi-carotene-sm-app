import {
  mapCampaignStatus,
  parseConversions,
  parseMetricDecimal,
  parseMetricInt,
  parseSpend,
  getMetaInsightChunksForSpan,
} from "@/features/growth-and-analytics/utils/metaSyncMappers";
import { getAdAccBackfillMetaRange } from "@/features/growth-and-analytics/utils/adAccBackfillWindow";
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
  objectiveByCampaignId: Map<string, string | null>,
): AdCampaignMetricInsert | null {
  const campaignId = insight.campaign_id?.trim();
  const metricDate = insight.date_start?.trim();
  if (!campaignId || !metricDate) return null;

  return {
    campaignId,
    campaignName: insight.campaign_name?.trim() || "Unnamed campaign",
    status: mapCampaignStatus(statusByCampaignId.get(campaignId)),
    objective: objectiveByCampaignId.get(campaignId) ?? null,
    metricDate,
    spend: parseSpend(insight.spend),
    impressions: parseMetricInt(insight.impressions),
    reach: parseMetricInt(insight.reach),
    clicks: parseMetricInt(insight.clicks),
    cpm: parseMetricDecimal(insight.cpm),
    frequency: parseMetricDecimal(insight.frequency),
    conversions: parseConversions(insight.actions),
  };
}

export async function runAdBackfill(
  adAccountId: string,
  metaAdAccountId: string,
  accessToken: string,
): Promise<number> {
  const range = getAdAccBackfillMetaRange();
  const campaigns = await fetchAdCampaignStatuses(metaAdAccountId, accessToken);
  const statusByCampaignId = new Map(
    campaigns.map((campaign) => [campaign.id, campaign.status ?? ""]),
  );
  const objectiveByCampaignId = new Map(
    campaigns.map((campaign) => [campaign.id, campaign.objective ?? null]),
  );

  const rows: AdCampaignMetricInsert[] = [];
  const chunks = getMetaInsightChunksForSpan(range.from, range.to);

  for (const chunk of chunks) {
    const insights = await fetchAdDailyInsights(metaAdAccountId, accessToken, chunk);
    for (const insight of insights) {
      const row = mapInsightToInsert(
        insight,
        statusByCampaignId,
        objectiveByCampaignId,
      );
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
  return runAdBackfill(adAccountId, metaAdAccountId, accessToken);
}
