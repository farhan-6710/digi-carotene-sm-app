<?php

declare(strict_types=1);

/**
 * Rolling ads sync — Meta + Google last ADS_ROLLING_DAYS (includes yesterday).
 */

require_once __DIR__ . '/../../lib/supabase.php';
require_once __DIR__ . '/../../lib/meta.php';
require_once __DIR__ . '/../../lib/google_ads.php';
require_once __DIR__ . '/../../lib/sync_windows.php';
require_once __DIR__ . '/meta_ads_range_sync.php';

/**
 * @param array<string, mixed> $config
 */
function runAdsRollingSync(array $config): void
{
    $timezone = (string) ($config['timezone'] ?? 'UTC');
    $window = syncWindowDates($timezone, ADS_ROLLING_DAYS);
    $fromDate = $window['fromDate'];
    $toDate = $window['toDate'];
    $yesterdayDate = $window['yesterdayDate'];

    logLine(
        'Starting ad sync. window=' . $fromDate . '..' . $toDate
        . ' (' . ADS_ROLLING_DAYS . 'd, includes yesterday=' . $yesterdayDate . ')',
    );

    $accounts = fetchAdAccounts($config);
    if ($accounts === []) {
        logLine('No growth_ad_accounts rows found.');
        return;
    }

    foreach ($accounts as $account) {
        if (!is_array($account)) {
            continue;
        }

        $accountName = (string) ($account['account_name'] ?? '');
        $platform = strtolower(trim((string) ($account['platform'] ?? 'meta_ads')));
        if ($platform === '') {
            $platform = 'meta_ads';
        }

        logLine('Syncing ' . $accountName . ' (' . $platform . ')');

        try {
            if ($platform === 'google_ads') {
                syncGoogleAdAccountForDateRange($config, $account, $fromDate, $toDate);
                continue;
            }

            if ($platform !== 'meta_ads') {
                logLine('Skipping unsupported ads platform "' . $platform . '": ' . $accountName);
                continue;
            }

            syncMetaAdAccountForDateRange($config, $account, $fromDate, $toDate);
        } catch (Throwable $error) {
            logLine('Error for ' . $accountName . ': ' . $error->getMessage());
        }
    }

    logLine(
        'Ad sync complete. window=' . $fromDate . '..' . $toDate
        . ' (' . ADS_ROLLING_DAYS . 'd, includes yesterday=' . $yesterdayDate . ')',
    );
}
