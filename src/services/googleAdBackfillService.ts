import { AD_BACKFILL_DAYS } from "@/features/growth-and-analytics/constants/metaConfig";
import { getAdAccBackfillMetaRange } from "@/features/growth-and-analytics/utils/adAccBackfillWindow";
import {
  assertBackfillNotAborted,
  reportBackfillProgress,
  type BackfillProgressOptions,
} from "@/features/growth-and-analytics/utils/backfillProgress";
import {
  googleAdsCpm,
  googleAdsDateFilter,
  googleAdsMetricGet,
  googleAdsMicrosToCurrency,
  googleAdsParseInt,
  googleAdsRowHasDelivery,
  mapGoogleCampaignStatus,
} from "@/features/growth-and-analytics/utils/googleAdsMetricMap";
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
import { touchAdAccountLastSynced } from "@/services/campaignLearningService";
import { DB } from "@/services/db";
import { openGoogleAdsSession, searchGoogleAds } from "@/services/googleAdsService";
import { supabase } from "@/services/supabaseClient";

type GoogleAccountCreds = {
  id: string;
  ad_account_id: string;
  manager_id: string | null;
  developer_token: string | null;
  oauth_client_id: string | null;
  oauth_client_secret: string | null;
  oauth_refresh_token: string | null;
};

async function fetchGoogleAccountCreds(
  adAccountRowId: string,
): Promise<GoogleAccountCreds> {
  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .select(
      "id, ad_account_id, manager_id, developer_token, oauth_client_id, oauth_client_secret, oauth_refresh_token",
    )
    .eq("id", adAccountRowId)
    .eq("platform", "google_ads")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Google Ads account not found.");
  return data as GoogleAccountCreds;
}

function nested(
  row: Record<string, unknown>,
  camel: string,
  snake: string,
): Record<string, unknown> {
  const value = row[camel] ?? row[snake];
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * Browser TypeScript 90-day Google Ads backfill (same window as Meta).
 * Replaces the old Hostinger PHP Google sync script.
 */
export async function runGoogleAdBackfill(
  adAccountRowId: string,
  days: number = AD_BACKFILL_DAYS,
  options?: BackfillProgressOptions,
): Promise<number> {
  assertBackfillNotAborted(options?.signal);

  void days;
  const range = getAdAccBackfillMetaRange();
  const fromDate = range.from;
  const toDate = range.to;
  const dateFilter = googleAdsDateFilter(fromDate, toDate);
  const total = 5;

  reportBackfillProgress(options, {
    completed: 0,
    total,
    label: "Connecting to Google Ads…",
  });

  const creds = await fetchGoogleAccountCreds(adAccountRowId);
  const session = await openGoogleAdsSession({
    customerId: creds.ad_account_id,
    managerId: creds.manager_id ?? "",
    developerToken: creds.developer_token ?? "",
    oauthClientId: creds.oauth_client_id ?? "",
    oauthClientSecret: creds.oauth_client_secret ?? "",
    oauthRefreshToken: creds.oauth_refresh_token ?? "",
  });
  assertBackfillNotAborted(options?.signal);

  reportBackfillProgress(options, {
    completed: 1,
    total,
    label: "Loading campaigns and ads…",
  });

  const [adGroupMasters, adMasters] = await Promise.all([
    searchGoogleAds(
      session,
      "SELECT campaign.id, ad_group.id, ad_group.name FROM ad_group WHERE ad_group.status != 'REMOVED'",
    ),
    searchGoogleAds(
      session,
      "SELECT campaign.id, ad_group.id, ad_group_ad.ad.id, ad_group_ad.ad.name FROM ad_group_ad WHERE ad_group_ad.status != 'REMOVED'",
    ),
  ]);
  assertBackfillNotAborted(options?.signal);

  const adsetMasterRows: AdsetMasterInsert[] = [];
  for (const row of adGroupMasters) {
    const campaign = nested(row, "campaign", "campaign");
    const adGroup = nested(row, "adGroup", "ad_group");
    const campaignId = String(campaign.id ?? "").trim();
    const adsetId = String(adGroup.id ?? "").trim();
    if (!campaignId || !adsetId) continue;
    adsetMasterRows.push({
      campaignId,
      adsetId,
      adsetName: String(adGroup.name ?? "").trim() || "Unnamed ad group",
      performanceGoal: null,
      locationSummary: null,
      ageSummary: null,
      customTargetingSummary: null,
      detailedTargetingSummary: null,
      placementsSummary: null,
    });
  }

  const adMasterRows: AdMasterInsert[] = [];
  for (const row of adMasters) {
    const campaign = nested(row, "campaign", "campaign");
    const adGroup = nested(row, "adGroup", "ad_group");
    const adGroupAd = nested(row, "adGroupAd", "ad_group_ad");
    const ad = nested(adGroupAd, "ad", "ad");
    const campaignId = String(campaign.id ?? "").trim();
    const adsetId = String(adGroup.id ?? "").trim();
    const adId = String(ad.id ?? "").trim();
    if (!campaignId || !adsetId || !adId) continue;
    adMasterRows.push({
      campaignId,
      adsetId,
      adId,
      adName: String(ad.name ?? "").trim() || "Unnamed ad",
      thumbnailUrl: null,
      primaryText: null,
      headline: null,
    });
  }

  reportBackfillProgress(options, {
    completed: 2,
    total,
    label: "Pulling the last 90 days of campaign results…",
  });

  const campaignRowsRaw = await searchGoogleAds(
    session,
    "SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, "
      + "segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, "
      + "metrics.conversions, metrics.conversions_value, metrics.average_cpm "
      + `FROM campaign WHERE ${dateFilter}`,
  );
  assertBackfillNotAborted(options?.signal);

  const campaignRows: AdCampaignMetricInsert[] = [];
  for (const row of campaignRowsRaw) {
    const metrics = nested(row, "metrics", "metrics");
    if (!googleAdsRowHasDelivery(metrics)) continue;
    const campaign = nested(row, "campaign", "campaign");
    const segments = nested(row, "segments", "segments");
    const campaignId = String(campaign.id ?? "").trim();
    if (!campaignId) continue;
    const channel =
      (campaign.advertisingChannelType as string | undefined) ??
      (campaign.advertising_channel_type as string | undefined) ??
      null;
    const impressions = googleAdsParseInt(
      googleAdsMetricGet(metrics, "impressions") ?? 0,
    );
    campaignRows.push({
      campaignId,
      campaignName: String(campaign.name ?? "").trim() || "Unnamed campaign",
      status: mapGoogleCampaignStatus(
        typeof campaign.status === "string" ? campaign.status : null,
      ),
      objective: channel,
      metricDate: String(segments.date ?? toDate).trim() || toDate,
      spend: googleAdsMicrosToCurrency(
        googleAdsMetricGet(metrics, "costMicros", "cost_micros") ?? 0,
      ),
      impressions,
      reach: impressions,
      clicks: googleAdsParseInt(googleAdsMetricGet(metrics, "clicks") ?? 0),
      cpm: googleAdsCpm(metrics),
      frequency: 0,
      conversions: Math.round(
        Number(googleAdsMetricGet(metrics, "conversions") ?? 0),
      ),
      conversionValue:
        Math.round(
          Number(
            googleAdsMetricGet(metrics, "conversionsValue", "conversions_value") ??
              0,
          ) * 100,
        ) / 100,
    });
  }

  reportBackfillProgress(options, {
    completed: 3,
    total,
    label: "Pulling ad group and ad results…",
  });

  const [adGroupRowsRaw, adRowsRaw] = await Promise.all([
    searchGoogleAds(
      session,
      "SELECT campaign.id, ad_group.id, ad_group.name, segments.date, "
        + "metrics.impressions, metrics.clicks, metrics.cost_micros, "
        + `metrics.conversions, metrics.average_cpm FROM ad_group WHERE ${dateFilter}`,
    ),
    searchGoogleAds(
      session,
      "SELECT campaign.id, ad_group.id, ad_group_ad.ad.id, ad_group_ad.ad.name, segments.date, "
        + "metrics.impressions, metrics.clicks, metrics.cost_micros, "
        + `metrics.conversions, metrics.average_cpm FROM ad_group_ad WHERE ${dateFilter}`,
    ),
  ]);
  assertBackfillNotAborted(options?.signal);

  const adsetRows: AdsetMetricInsert[] = [];
  for (const row of adGroupRowsRaw) {
    const metrics = nested(row, "metrics", "metrics");
    if (!googleAdsRowHasDelivery(metrics)) continue;
    const campaign = nested(row, "campaign", "campaign");
    const adGroup = nested(row, "adGroup", "ad_group");
    const segments = nested(row, "segments", "segments");
    const campaignId = String(campaign.id ?? "").trim();
    const adsetId = String(adGroup.id ?? "").trim();
    if (!campaignId || !adsetId) continue;
    const impressions = googleAdsParseInt(
      googleAdsMetricGet(metrics, "impressions") ?? 0,
    );
    adsetRows.push({
      campaignId,
      adsetId,
      adsetName: String(adGroup.name ?? "").trim() || "Unnamed ad group",
      metricDate: String(segments.date ?? toDate).trim() || toDate,
      spend: googleAdsMicrosToCurrency(
        googleAdsMetricGet(metrics, "costMicros", "cost_micros") ?? 0,
      ),
      impressions,
      reach: impressions,
      clicks: googleAdsParseInt(googleAdsMetricGet(metrics, "clicks") ?? 0),
      cpm: googleAdsCpm(metrics),
      frequency: 0,
      conversions: Math.round(
        Number(googleAdsMetricGet(metrics, "conversions") ?? 0),
      ),
    });
  }

  const adRows: AdMetricInsert[] = [];
  for (const row of adRowsRaw) {
    const metrics = nested(row, "metrics", "metrics");
    if (!googleAdsRowHasDelivery(metrics)) continue;
    const campaign = nested(row, "campaign", "campaign");
    const adGroup = nested(row, "adGroup", "ad_group");
    const adGroupAd = nested(row, "adGroupAd", "ad_group_ad");
    const ad = nested(adGroupAd, "ad", "ad");
    const segments = nested(row, "segments", "segments");
    const campaignId = String(campaign.id ?? "").trim();
    const adsetId = String(adGroup.id ?? "").trim();
    const adId = String(ad.id ?? "").trim();
    if (!campaignId || !adsetId || !adId) continue;
    const impressions = googleAdsParseInt(
      googleAdsMetricGet(metrics, "impressions") ?? 0,
    );
    adRows.push({
      campaignId,
      adsetId,
      adId,
      adName: String(ad.name ?? "").trim() || "Unnamed ad",
      metricDate: String(segments.date ?? toDate).trim() || toDate,
      spend: googleAdsMicrosToCurrency(
        googleAdsMetricGet(metrics, "costMicros", "cost_micros") ?? 0,
      ),
      impressions,
      reach: impressions,
      clicks: googleAdsParseInt(googleAdsMetricGet(metrics, "clicks") ?? 0),
      cpm: googleAdsCpm(metrics),
      frequency: 0,
      conversions: Math.round(
        Number(googleAdsMetricGet(metrics, "conversions") ?? 0),
      ),
    });
  }

  reportBackfillProgress(options, {
    completed: 4,
    total,
    label: "Saving results…",
  });

  await Promise.all([
    replaceAdsetsForAccount(adAccountRowId, adsetMasterRows),
    replaceAdsForAccount(adAccountRowId, adMasterRows),
    replaceAdCampaignMetricsForAccount(
      adAccountRowId,
      fromDate,
      toDate,
      campaignRows,
    ),
    replaceAdsetMetricsForAccount(adAccountRowId, fromDate, toDate, adsetRows),
    replaceAdMetricsForAccount(adAccountRowId, fromDate, toDate, adRows),
  ]);

  await touchAdAccountLastSynced(adAccountRowId);

  reportBackfillProgress(options, {
    completed: total,
    total,
    label: "All set — finishing up…",
  });

  return campaignRows.length + adsetRows.length + adRows.length;
}

/** Connect / Refetch entry — same API as the old PHP trigger. */
export async function triggerGoogleAdAccountBackfill(
  adAccountRowId: string,
  days: number = AD_BACKFILL_DAYS,
  options?: BackfillProgressOptions,
): Promise<void> {
  await runGoogleAdBackfill(adAccountRowId, days, options);
}
