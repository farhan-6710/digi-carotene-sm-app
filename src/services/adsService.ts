import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Ad } from "@/features/growth-and-analytics/types/types";

type AdRow = {
  ad_account_id: string;
  campaign_id: string;
  adset_id: string;
  ad_id: string;
  ad_name: string;
  thumbnail_url: string | null;
  primary_text: string | null;
  headline: string | null;
};

function mapAd(row: AdRow): Ad {
  return {
    adId: row.ad_id,
    adsetId: row.adset_id,
    campaignId: row.campaign_id,
    adName: row.ad_name,
    thumbnailUrl: row.thumbnail_url,
    primaryText: row.primary_text,
    headline: row.headline,
  };
}

export type AdMasterInsert = {
  campaignId: string;
  adsetId: string;
  adId: string;
  adName: string;
  thumbnailUrl: string | null;
  primaryText: string | null;
  headline: string | null;
};

function toInsertRow(adAccountId: string, row: AdMasterInsert) {
  return {
    ad_account_id: adAccountId,
    campaign_id: row.campaignId,
    adset_id: row.adsetId,
    ad_id: row.adId,
    ad_name: row.adName,
    thumbnail_url: row.thumbnailUrl,
    primary_text: row.primaryText,
    headline: row.headline,
  };
}

export async function fetchAdsByAdset(
  adAccountId: string,
  adsetId: string,
): Promise<Ad[]> {
  const { data, error } = await supabase
    .from(DB.ADS.TABLE)
    .select(DB.ADS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .order("ad_name", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as AdRow[]).map(mapAd);
}

export async function fetchAdById(
  adAccountId: string,
  adId: string,
): Promise<Ad | null> {
  const { data, error } = await supabase
    .from(DB.ADS.TABLE)
    .select(DB.ADS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("ad_id", adId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapAd(data as AdRow);
}

export async function replaceAdsForAccount(
  adAccountId: string,
  rows: AdMasterInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.ADS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.ADS.TABLE)
    .insert(rows.map((row) => toInsertRow(adAccountId, row)));

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdMaster(
  adAccountId: string,
  row: AdMasterInsert,
): Promise<void> {
  const { error } = await supabase
    .from(DB.ADS.TABLE)
    .upsert(toInsertRow(adAccountId, row), { onConflict: "ad_account_id,ad_id" });

  if (error) throw new Error(error.message);
}

export async function clearAdsForAccount(adAccountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.ADS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);
}
