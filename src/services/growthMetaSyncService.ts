import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

async function clearDailyMetrics(accountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_DAILY_METRICS.TABLE)
    .delete()
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
}

async function clearPosts(accountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_POSTS.TABLE)
    .delete()
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
}

async function clearAdMetrics(adAccountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_CAMPAIGN_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);
  if (error) throw new Error(error.message);
}

/** Clears stale cached metrics after a token refresh (pages fetch live from Meta). */
export async function clearOrganicCachedMetrics(accountId: string): Promise<void> {
  await clearDailyMetrics(accountId);
  await clearPosts(accountId);
}

export async function clearAdCachedMetrics(adAccountId: string): Promise<void> {
  await clearAdMetrics(adAccountId);
}
