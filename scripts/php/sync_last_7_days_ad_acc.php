<?php

declare(strict_types=1);

/**
 * Midnight ad account sync — last 7 days of Meta + Google daily metrics
 * (window ends at yesterday; includes yesterday).
 *
 * CLI:  php sync_last_7_days_ad_acc.php
 * HTTP: .../sync_last_7_days_ad_acc.php?secret=YOUR_CRON_SECRET
 *
 * Google connect 90-day history: sync_google_ad_acc_backfill.php
 */

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/sync/ads/run_ads_rolling_sync.php';

try {
    $config = loadConfig();
    assertCronAccess($config);
    runAdsRollingSync($config);
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
