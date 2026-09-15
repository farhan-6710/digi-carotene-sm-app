<?php

declare(strict_types=1);

/**
 * Google Ads historical backfill — matrix-driven sync for N days (default 90).
 *
 * CLI:  php sync_google_ad_acc_backfill.php [days] [account_id]
 * HTTP: .../sync_google_ad_acc_backfill.php?secret=YOUR_CRON_SECRET&days=90
 * Optional: &account_id=<growth_ad_accounts.id>
 *
 * Called from Manage Accounts after Google connect (browser → this URL).
 * Midnight yesterday sync stays on sync_yesterday_ad_acc.php.
 */

require_once __DIR__ . '/lib/supabase.php';
require_once __DIR__ . '/lib/meta.php';
require_once __DIR__ . '/lib/google_ads.php';

function googleAdsBackfillSendCorsHeaders(): void
{
    if (PHP_SAPI === 'cli' || PHP_SAPI === 'phpdbg') {
        return;
    }

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Cron-Secret');
}

googleAdsBackfillSendCorsHeaders();

if (
    PHP_SAPI !== 'cli'
    && PHP_SAPI !== 'phpdbg'
    && strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')) === 'OPTIONS'
) {
    http_response_code(204);
    exit(0);
}

try {
    @set_time_limit(600);

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
    $matched = 0;

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

        $matched++;
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

    if ($onlyAccountId !== '' && $matched === 0) {
        cronFail('No google_ads account found for id=' . $onlyAccountId, 404);
    }

    logLine('Backfill finished. ok=' . $synced . ' failed=' . $failed);

    if ($failed > 0) {
        if (PHP_SAPI !== 'cli' && PHP_SAPI !== 'phpdbg') {
            http_response_code(500);
        }
        exit(1);
    }

    exit(0);
} catch (Throwable $e) {
    logLine('FATAL: ' . $e->getMessage());
    if (PHP_SAPI !== 'cli' && PHP_SAPI !== 'phpdbg') {
        http_response_code(500);
    }
    exit(1);
}
