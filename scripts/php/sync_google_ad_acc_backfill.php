<?php

declare(strict_types=1);

/**
 * Google Ads historical backfill — matrix-driven sync for N days (default 90).
 *
 * CLI:  php sync_google_ad_acc_backfill.php [days] [account_id]
 * HTTP: .../sync_google_ad_acc_backfill.php?secret=YOUR_CRON_SECRET&days=90
 * Optional: &account_id=<growth_ad_accounts.id>
 */

require_once __DIR__ . '/lib/supabase.php';
require_once __DIR__ . '/lib/meta.php';
require_once __DIR__ . '/lib/google_ads.php';

try {
    $config = loadConfig();
    assertCronAccess($config);

    $days = 90;
    $onlyAccountId = '';
    if (PHP_SAPI === 'cli') {
        $days = isset($argv[1]) ? max(1, (int) $argv[1]) : 90;
        $onlyAccountId = (string) ($argv[2] ?? '');
    } else {
        $days = isset($_GET['days']) ? max(1, (int) $_GET['days']) : 90;
        $onlyAccountId = (string) ($_GET['account_id'] ?? '');
    }

    $tz = new DateTimeZone($config['timezone'] ?? 'UTC');
    $yesterday = new DateTimeImmutable('yesterday', $tz);
    $toDate = $yesterday->format('Y-m-d');
    $fromDate = $yesterday->modify('-' . ($days - 1) . ' days')->format('Y-m-d');

    logLine('Google Ads backfill ' . $fromDate . ' .. ' . $toDate . ' (' . $days . ' days)');

    $accounts = fetchAdAccounts($config);
    $synced = 0;
    $failed = 0;

    foreach ($accounts as $account) {
        if (!is_array($account)) {
            continue;
        }
        if ((string) ($account['platform'] ?? '') !== 'google_ads') {
            continue;
        }
        $id = (string) ($account['id'] ?? '');
        if ($onlyAccountId !== '' && $id !== $onlyAccountId) {
            continue;
        }

        $name = (string) ($account['account_name'] ?? $id);
        try {
            logLine('Backfilling ' . $name . '…');
            syncGoogleAdAccountForDateRange($config, $account, $fromDate, $toDate);
            $synced++;
        } catch (Throwable $e) {
            $failed++;
            logLine('FAIL ' . $name . ': ' . $e->getMessage());
        }
    }

    logLine('Backfill finished. ok=' . $synced . ' failed=' . $failed);
    exit($failed > 0 ? 1 : 0);
} catch (Throwable $e) {
    logLine('FATAL: ' . $e->getMessage());
    exit(1);
}
