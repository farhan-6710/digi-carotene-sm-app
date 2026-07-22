import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Adset } from "@/features/growth-and-analytics/types/types";

type AdsetRow = {
  ad_account_id: string;
  campaign_id: string;
  adset_id: string;
  adset_name: string;
  performance_goal: string | null;
  location_summary: string | null;
  age_summary: string | null;
  custom_targeting_summary: string | null;
  detailed_targeting_summary: string | null;
  placements_summary: string | null;
};

function mapAdset(row: AdsetRow): Adset {
  return {
    adsetId: row.adset_id,
    campaignId: row.campaign_id,
    adsetName: row.adset_name,
    performanceGoal: row.performance_goal,
    locationSummary: row.location_summary,
    ageSummary: row.age_summary,
    customTargetingSummary: row.custom_targeting_summary,
    detailedTargetingSummary: row.detailed_targeting_summary,
    placementsSummary: row.placements_summary,
  };
}

export type AdsetMasterInsert = {
  campaignId: string;
  adsetId: string;
  adsetName: string;
  performanceGoal: string | null;
  locationSummary: string | null;
  ageSummary: string | null;
  customTargetingSummary: string | null;
  detailedTargetingSummary: string | null;
  placementsSummary: string | null;
};

function toInsertRow(adAccountId: string, row: AdsetMasterInsert) {
  return {
    ad_account_id: adAccountId,
    campaign_id: row.campaignId,
    adset_id: row.adsetId,
    adset_name: row.adsetName,
    performance_goal: row.performanceGoal,
    location_summary: row.locationSummary,
    age_summary: row.ageSummary,
    custom_targeting_summary: row.customTargetingSummary,
    detailed_targeting_summary: row.detailedTargetingSummary,
    placements_summary: row.placementsSummary,
  };
}

export async function fetchAdsetsByCampaign(
  adAccountId: string,
  campaignId: string,
): Promise<Adset[]> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ADS_ADSETS.TABLE)
    .select(DB.GROWTH_ADS_ADSETS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("campaign_id", campaignId)
    .order("adset_name", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as AdsetRow[]).map(mapAdset);
}

export async function fetchAdsetById(
  adAccountId: string,
  adsetId: string,
): Promise<Adset | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ADS_ADSETS.TABLE)
    .select(DB.GROWTH_ADS_ADSETS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapAdset(data as AdsetRow);
}

export async function replaceAdsetsForAccount(
  adAccountId: string,
  rows: AdsetMasterInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.GROWTH_ADS_ADSETS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.GROWTH_ADS_ADSETS.TABLE)
    .insert(rows.map((row) => toInsertRow(adAccountId, row)));

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdsetMaster(
  adAccountId: string,
  row: AdsetMasterInsert,
): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_ADS_ADSETS.TABLE)
    .upsert(toInsertRow(adAccountId, row), { onConflict: "ad_account_id,adset_id" });

  if (error) throw new Error(error.message);
}

export async function clearAdsetsForAccount(adAccountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_ADS_ADSETS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);
}
