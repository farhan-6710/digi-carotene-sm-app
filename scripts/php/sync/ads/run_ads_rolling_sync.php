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
 * @param string|null $onlyAccountId Optional growth_ad_accounts.id — sync one account (faster browser test)
 */
function runAdsRollingSync(array $config, ?string $onlyAccountId = null): void
{
    $timezone = (string) ($config['timezone'] ?? 'UTC');
    $window = syncWindowDates($timezone, ADS_ROLLING_DAYS);
    $fromDate = $window['fromDate'];
    $toDate = $window['toDate'];
    $yesterdayDate = $window['yesterdayDate'];
    $onlyAccountId = $onlyAccountId !== null ? trim($onlyAccountId) : '';
    if ($onlyAccountId === '') {
        $onlyAccountId = null;
    }

    $jobRunId = startGrowthJobRun($config, 'ads_rolling_7d', [
        'from' => $fromDate,
        'to' => $toDate,
        'only_account_id' => $onlyAccountId,
    ]);

    logLine(
        'Starting ad sync. window=' . $fromDate . '..' . $toDate
        . ' (' . ADS_ROLLING_DAYS . 'd, includes yesterday=' . $yesterdayDate . ')'
        . ($onlyAccountId !== null ? ' account_id=' . $onlyAccountId : ''),
    );

    $accounts = fetchAdAccounts($config);
    if ($accounts === []) {
        logLine('No growth_ad_accounts rows found.');
        finishGrowthJobRun($config, $jobRunId, 'error', 'No growth_ad_accounts rows found.');
        return;
    }

    $ok = 0;
    $failed = 0;
    $skipped = 0;
    $errors = [];

    foreach ($accounts as $account) {
        if (!is_array($account)) {
            continue;
        }

        $accountName = (string) ($account['account_name'] ?? '');
        $accountId = (string) ($account['id'] ?? '');
        if ($onlyAccountId !== null && $accountId !== $onlyAccountId) {
            continue;
        }

        $platform = strtolower(trim((string) ($account['platform'] ?? 'meta_ads')));
        if ($platform === '') {
            $platform = 'meta_ads';
        }

        $token = trim((string) ($account['access_token'] ?? ''));
        if ($platform === 'meta_ads' && $token === '') {
            logLine('SKIP ' . $accountName . ': missing access_token (reconnect in Manage Accounts)');
            $skipped++;
            continue;
        }

        logLine('Syncing ' . $accountName . ' (' . $platform . ')');

        try {
            if ($platform === 'google_ads') {
                syncGoogleAdAccountForDateRange($config, $account, $fromDate, $toDate);
                if ($accountId !== '') {
                    touchAdAccountLastSynced($config, $accountId);
                }
                $ok++;
                continue;
            }

            if ($platform !== 'meta_ads') {
                logLine('SKIP unsupported ads platform "' . $platform . '": ' . $accountName);
                $skipped++;
                continue;
            }

            syncMetaAdAccountForDateRange($config, $account, $fromDate, $toDate);
            if ($accountId !== '') {
                touchAdAccountLastSynced($config, $accountId);
            }
            $ok++;
        } catch (Throwable $error) {
            $failed++;
            $msg = $accountName . ': ' . $error->getMessage();
            $errors[] = $msg;
            logLine('ERROR ' . $msg);
        }
    }

    $summary =
        'window=' . $fromDate . '..' . $toDate
        . ' ok=' . $ok . ' failed=' . $failed . ' skipped=' . $skipped
        . ' (yesterday=' . $yesterdayDate . ')';
    logLine('Ad sync complete. ' . $summary);

    $status = $failed > 0 && $ok === 0 ? 'error' : 'success';
    $errorText = $errors === [] ? null : implode(' | ', array_slice($errors, 0, 5));
    finishGrowthJobRun($config, $jobRunId, $status, $errorText, [
        'from' => $fromDate,
        'to' => $toDate,
        'ok' => $ok,
        'failed' => $failed,
        'skipped' => $skipped,
    ]);
}
