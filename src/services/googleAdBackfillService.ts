import { AD_BACKFILL_DAYS } from "@/features/growth-and-analytics/constants/metaConfig";

/**
 * After Google connect: Hostinger PHP 90-day backfill.
 * (Google Ads API is blocked by browser CORS; Meta Graph is not.)
 *
 * Env: VITE_GROWTH_PHP_BASE_URL, VITE_GROWTH_PHP_CRON_SECRET
 */
export async function triggerGoogleAdAccountBackfill(
  adAccountRowId: string,
  days: number = AD_BACKFILL_DAYS,
): Promise<void> {
  const baseUrl = (import.meta.env.VITE_GROWTH_PHP_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const secret = import.meta.env.VITE_GROWTH_PHP_CRON_SECRET ?? "";

  if (!baseUrl || !secret) {
    throw new Error(
      "Google Ads 90-day sync is not configured. Set VITE_GROWTH_PHP_BASE_URL and VITE_GROWTH_PHP_CRON_SECRET (same cron_secret as Hostinger php/config.php), then rebuild.",
    );
  }

  const url = new URL(`${baseUrl}/sync_google_ad_acc_backfill.php`);
  url.searchParams.set("secret", secret);
  url.searchParams.set("days", String(days));
  url.searchParams.set("account_id", adAccountRowId);

  const response = await fetch(url.toString(), { method: "GET" });
  const body = (await response.text()).trim();

  if (!response.ok) {
    throw new Error(
      body ||
        `Google Ads backfill failed (HTTP ${response.status}). Check Hostinger PHP logs.`,
    );
  }

  if (/FATAL:|FAIL |failed=[1-9]/i.test(body)) {
    throw new Error(
      body.slice(0, 400) ||
        "Google Ads backfill reported a failure. Check Hostinger PHP logs.",
    );
  }

  if (!/Backfill finished/i.test(body)) {
    throw new Error(
      body.slice(0, 400) ||
        "Google Ads backfill returned an unexpected response.",
    );
  }
}
