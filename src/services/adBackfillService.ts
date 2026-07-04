import { mapMetaAdsetSummaries } from "@/features/growth-and-analytics/utils/adMetaParsing";
import {
  mapCampaignStatus,
  parseInsightConversions,
  parseMetricDecimal,
  parseMetricInt,
  parseSpend,
  getMetaInsightChunksForSpan,
  hasAdDeliveryMetrics,
} from "@/features/growth-and-analytics/utils/metaSyncMappers";
import { getAdAccBackfillMetaRange } from "@/features/growth-and-analytics/utils/adAccBackfillWindow";
import {
  fetchAdCampaignStatuses,
  fetchAdDailyInsights,
  fetchAdMasters,
  fetchAdsetMasters,
  type AdDailyInsight,
  type AdHierarchyInsight,
  type MetaAd,
  type MetaAdset,
} from "@/services/metaService";
import {
  replaceAdCampaignMetricsForAccount,
  type AdCampaignMetricInsert,
} from "@/services/adCampaignMetricsService";
import {
  replaceAdsetMetricsForAccount,
  type AdsetMetricInsert,
} from "@/services/adsetMetricsService";
import { replaceAdsetsForAccount, type AdsetMasterInsert } from "@/services/adsetsService";
import { replaceAdMetricsForAccount, type AdMetricInsert } from "@/services/adMetricsService";
import { replaceAdsForAccount, type AdMasterInsert } from "@/services/adsService";

function mapCampaignInsightToInsert(
  insight: AdDailyInsight,
  statusByCampaignId: Map<string, string>,
  objectiveByCampaignId: Map<string, string | null>,
): AdCampaignMetricInsert | null {
  const campaignId = insight.campaign_id?.trim();
  const metricDate = insight.date_start?.trim();
  if (!campaignId || !metricDate) return null;
  if (!hasAdDeliveryMetrics(insight)) return null;

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
    conversions: parseInsightConversions(insight),
  };
}

function mapAdsetInsightToInsert(insight: AdHierarchyInsight): AdsetMetricInsert | null {
  const adsetId = insight.adset_id?.trim();
  const campaignId = insight.campaign_id?.trim();
  const metricDate = insight.date_start?.trim();
  if (!adsetId || !campaignId || !metricDate) return null;
  if (!hasAdDeliveryMetrics(insight)) return null;

  return {
    campaignId,
    adsetId,
    adsetName: insight.adset_name?.trim() || "Unnamed ad set",
    metricDate,
    spend: parseSpend(insight.spend),
    impressions: parseMetricInt(insight.impressions),
    reach: parseMetricInt(insight.reach),
    clicks: parseMetricInt(insight.clicks),
    cpm: parseMetricDecimal(insight.cpm),
    frequency: parseMetricDecimal(insight.frequency),
    conversions: parseInsightConversions(insight),
  };
}

function mapAdInsightToInsert(insight: AdHierarchyInsight): AdMetricInsert | null {
  const adId = insight.ad_id?.trim();
  const adsetId = insight.adset_id?.trim();
  const campaignId = insight.campaign_id?.trim();
  const metricDate = insight.date_start?.trim();
  if (!adId || !adsetId || !campaignId || !metricDate) return null;
  if (!hasAdDeliveryMetrics(insight)) return null;

  return {
    campaignId,
    adsetId,
    adId,
    adName: insight.ad_name?.trim() || "Unnamed ad",
    metricDate,
    spend: parseSpend(insight.spend),
    impressions: parseMetricInt(insight.impressions),
    reach: parseMetricInt(insight.reach),
    clicks: parseMetricInt(insight.clicks),
    cpm: parseMetricDecimal(insight.cpm),
    frequency: parseMetricDecimal(insight.frequency),
    conversions: parseInsightConversions(insight),
  };
}

function mapMetaAdsetToInsert(adset: MetaAdset): AdsetMasterInsert | null {
  const adsetId = adset.id?.trim();
  const campaignId = adset.campaign_id?.trim();
  if (!adsetId || !campaignId) return null;

  const summaries = mapMetaAdsetSummaries(adset);

  return {
    campaignId,
    adsetId,
    adsetName: adset.name?.trim() || "Unnamed ad set",
    performanceGoal: summaries.performanceGoal,
    locationSummary: summaries.locationSummary,
    ageSummary: summaries.ageSummary,
    customTargetingSummary: summaries.customTargetingSummary,
    detailedTargetingSummary: summaries.detailedTargetingSummary,
    placementsSummary: summaries.placementsSummary,
  };
}

function mapMetaAdToInsert(ad: MetaAd): AdMasterInsert | null {
  const adId = ad.id?.trim();
  const adsetId = ad.adset_id?.trim();
  const campaignId = ad.campaign_id?.trim();
  if (!adId || !adsetId || !campaignId) return null;

  const creative = ad.creative;

  return {
    campaignId,
    adsetId,
    adId,
    adName: ad.name?.trim() || "Unnamed ad",
    thumbnailUrl: creative?.thumbnail_url?.trim() || null,
    primaryText: creative?.body?.trim() || null,
    headline: creative?.title?.trim() || null,
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

  const [adsetMasters, adMasters] = await Promise.all([
    fetchAdsetMasters(metaAdAccountId, accessToken),
    fetchAdMasters(metaAdAccountId, accessToken),
  ]);

  const adsetMasterRows = adsetMasters
    .map(mapMetaAdsetToInsert)
    .filter((row): row is AdsetMasterInsert => row != null);
  const adMasterRows = adMasters
    .map(mapMetaAdToInsert)
    .filter((row): row is AdMasterInsert => row != null);

  const campaignRows: AdCampaignMetricInsert[] = [];
  const adsetRows: AdsetMetricInsert[] = [];
  const adRows: AdMetricInsert[] = [];
  const chunks = getMetaInsightChunksForSpan(range.from, range.to);

  for (const chunk of chunks) {
    const [campaignInsights, adsetInsights, adInsights] = await Promise.all([
      fetchAdDailyInsights(metaAdAccountId, accessToken, chunk, "campaign"),
      fetchAdDailyInsights(metaAdAccountId, accessToken, chunk, "adset"),
      fetchAdDailyInsights(metaAdAccountId, accessToken, chunk, "ad"),
    ]);

    for (const insight of campaignInsights) {
      const row = mapCampaignInsightToInsert(
        insight,
        statusByCampaignId,
        objectiveByCampaignId,
      );
      if (row) campaignRows.push(row);
    }

    for (const insight of adsetInsights) {
      const row = mapAdsetInsightToInsert(insight);
      if (row) adsetRows.push(row);
    }

    for (const insight of adInsights) {
      const row = mapAdInsightToInsert(insight);
      if (row) adRows.push(row);
    }
  }

  await Promise.all([
    replaceAdsetsForAccount(adAccountId, adsetMasterRows),
    replaceAdsForAccount(adAccountId, adMasterRows),
    replaceAdCampaignMetricsForAccount(adAccountId, range.from, range.to, campaignRows),
    replaceAdsetMetricsForAccount(adAccountId, range.from, range.to, adsetRows),
    replaceAdMetricsForAccount(adAccountId, range.from, range.to, adRows),
  ]);

  return campaignRows.length + adsetRows.length + adRows.length;
}

export async function rerunAdBackfillForAccount(
  adAccountId: string,
  metaAdAccountId: string,
  accessToken: string,
): Promise<number> {
  return runAdBackfill(adAccountId, metaAdAccountId, accessToken);
}
