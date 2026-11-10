<?php

declare(strict_types=1);

/**
 * Midnight ad account sync — last 7 days of Meta + Google daily metrics
 * (window ends at yesterday; includes yesterday).
 *
 * CLI:  php sync_last_7_days_ad_acc.php
 *       php sync_last_7_days_ad_acc.php --account=UUID
 * HTTP: .../sync_last_7_days_ad_acc.php?secret=YOUR_CRON_SECRET
 *       ...&account_id=UUID   (one account — use this in browser; full sync hits nginx 504)
 *
 * Google connect 90-day history: sync_google_ad_acc_backfill.php
 *
 * Note: Full sync via browser often gets nginx 504. Hostinger cron uses CLI (no 504).
 */

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/sync/ads/run_ads_rolling_sync.php';

/**
 * @param list<string> $argv
 */
function resolveAdsSyncAccountId(array $argv): ?string
{
    $fromQuery = is_string($_GET['account_id'] ?? null) ? trim((string) $_GET['account_id']) : '';
    if ($fromQuery !== '') {
        return $fromQuery;
    }

    foreach ($argv as $arg) {
        if (str_starts_with($arg, '--account=')) {
            $value = trim(substr($arg, strlen('--account=')));
            return $value !== '' ? $value : null;
        }
    }

    return null;
}

try {
    $config = loadConfig();
    assertCronAccess($config);

    // Browser runs buffer PHP output — flush so the tab is not a blank spinner
    // for several minutes while Meta/Google sync runs.
    if (!isCronCli()) {
        header('Content-Type: text/plain; charset=utf-8');
        header('X-Accel-Buffering: no');
        header('Cache-Control: no-cache');
        @ini_set('zlib.output_compression', '0');
        @ini_set('output_buffering', 'off');
        while (ob_get_level() > 0) {
            ob_end_flush();
        }
        ob_implicit_flush(true);
        echo "Ads sync started…\n";
        flush();
    }

    @set_time_limit(0);
    global $argv;
    $onlyAccountId = resolveAdsSyncAccountId(is_array($argv ?? null) ? $argv : []);
    runAdsRollingSync($config, $onlyAccountId);
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
