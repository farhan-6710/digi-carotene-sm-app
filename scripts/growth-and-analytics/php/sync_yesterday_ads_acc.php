<?php

declare(strict_types=1);

/**
 * Midnight ads account sync — yesterday's campaign metrics.
 * Run daily at 12:05 AM (server timezone in config.php).
 *
 * CLI:  php sync_yesterday_ads_acc.php
 * HTTP: https://your-domain.com/.../sync_yesterday_ads_acc.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/supabase.php';
require_once __DIR__ . '/lib/meta.php';

try {
    $config = loadConfig();

    if (PHP_SAPI !== 'cli') {
        $secret = (string) ($_GET['secret'] ?? '');
        $expected = (string) ($config['cron_secret'] ?? '');
        if ($expected === '' || !hash_equals($expected, $secret)) {
            http_response_code(403);
            echo 'Forbidden';
            exit(1);
        }
    }

    $tz = new DateTimeZone($config['timezone'] ?? 'UTC');
    $yesterdayStart = new DateTimeImmutable('yesterday', $tz);
    $yesterdayDate = $yesterdayStart->format('Y-m-d');

    logLine('Starting ad sync for ' . $yesterdayDate);

    $accounts = fetchAdAccounts($config);
    if ($accounts === []) {
        logLine('No growth_ad_accounts rows found.');
        exit(0);
    }

    foreach ($accounts as $account) {
        $accountId = (string) ($account['id'] ?? '');
        $metaAdAccountId = (string) ($account['ad_account_id'] ?? '');
        $accessToken = (string) ($account['access_token'] ?? '');
        $accountName = (string) ($account['account_name'] ?? '');

        if ($accountId === '' || $metaAdAccountId === '' || $accessToken === '') {
            logLine('Skipping ad account with missing credentials: ' . $accountName);
            continue;
        }

        logLine('Syncing ' . $accountName);

        try {
            $campaigns = fetchAdCampaignStatuses($config, $metaAdAccountId, $accessToken);
            $statusByCampaignId = [];
            $objectiveByCampaignId = [];
            foreach ($campaigns as $campaign) {
                if (!is_array($campaign)) {
                    continue;
                }
                $campaignId = is_string($campaign['id'] ?? null) ? $campaign['id'] : '';
                if ($campaignId === '') {
                    continue;
                }
                $statusByCampaignId[$campaignId] = is_string($campaign['status'] ?? null)
                    ? $campaign['status']
                    : '';
                $objective = $campaign['objective'] ?? null;
                $objectiveByCampaignId[$campaignId] = is_string($objective) ? $objective : null;
            }

            $insights = fetchAdDailyInsightsForDay(
                $config,
                $metaAdAccountId,
                $accessToken,
                $yesterdayDate,
            );
            $syncedRows = 0;

            foreach ($insights as $insight) {
                if (!is_array($insight)) {
                    continue;
                }

                $campaignId = is_string($insight['campaign_id'] ?? null)
                    ? trim($insight['campaign_id'])
                    : '';
                $metricDate = is_string($insight['date_start'] ?? null)
                    ? trim($insight['date_start'])
                    : $yesterdayDate;
                if ($campaignId === '') {
                    continue;
                }

                $campaignName = is_string($insight['campaign_name'] ?? null)
                    ? trim($insight['campaign_name'])
                    : 'Unnamed campaign';
                if ($campaignName === '') {
                    $campaignName = 'Unnamed campaign';
                }

                upsertAdCampaignMetric($config, $accountId, [
                    'campaign_id' => $campaignId,
                    'campaign_name' => $campaignName,
                    'status' => mapCampaignStatus($statusByCampaignId[$campaignId] ?? null),
                    'objective' => $objectiveByCampaignId[$campaignId] ?? null,
                    'metric_date' => $metricDate,
                    'spend' => parseSpend($insight['spend'] ?? 0),
                    'impressions' => parseMetricValue($insight['impressions'] ?? 0),
                    'reach' => parseMetricValue($insight['reach'] ?? 0),
                    'clicks' => parseMetricValue($insight['clicks'] ?? 0),
                    'cpm' => parseDecimal($insight['cpm'] ?? 0),
                    'frequency' => parseDecimal($insight['frequency'] ?? 0),
                    'conversions' => parseInsightConversions($insight),
                ]);
                $syncedRows++;
            }

            logLine('Done ' . $accountName . ': campaign_rows=' . $syncedRows);
        } catch (Throwable $error) {
            logLine('Error for ' . $accountName . ': ' . $error->getMessage());
        }
    }

    logLine('Ad sync complete.');
} catch (Throwable $error) {
    logLine('Fatal: ' . $error->getMessage());
    if (PHP_SAPI !== 'cli') {
        http_response_code(500);
    }
    exit(1);
}
