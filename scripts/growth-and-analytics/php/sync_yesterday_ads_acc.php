<?php

declare(strict_types=1);

/**
 * Midnight ads account sync — yesterday's campaign, adset, and ad metrics.
 * Run daily at 12:05 AM (server timezone in config.php).
 *
 * CLI:  php sync_yesterday_ads_acc.php
 * HTTP: https://your-domain.com/.../sync_yesterday_ads_acc.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/supabase.php';
require_once __DIR__ . '/lib/meta.php';

try {
    $config = loadConfig();
    assertCronAccess($config);

    $tz = new DateTimeZone($config['timezone'] ?? 'UTC');
    $yesterdayStart = new DateTimeImmutable('yesterday', $tz);
    $yesterdayDate = $yesterdayStart->format('Y-m-d');

    logLine('Starting ad sync for ' . $yesterdayDate);

    $accounts = fetchAdAccounts($config);
    if ($accounts === []) {
        logLine('No growth_ads_accounts rows found.');
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

            $adsetMasters = fetchAdsetMasters($config, $metaAdAccountId, $accessToken);
            $adMasters = fetchAdMasters($config, $metaAdAccountId, $accessToken);
            $syncedAdsetMasters = 0;
            $syncedAdMasters = 0;

            foreach ($adsetMasters as $adset) {
                if (!is_array($adset)) {
                    continue;
                }
                $row = mapMetaAdsetRow($adset);
                if ($row === null) {
                    continue;
                }
                upsertAdsetMaster($config, $accountId, $row);
                $syncedAdsetMasters++;
            }

            foreach ($adMasters as $ad) {
                if (!is_array($ad)) {
                    continue;
                }
                $row = mapMetaAdRow($ad);
                if ($row === null) {
                    continue;
                }
                upsertAdMaster($config, $accountId, $row);
                $syncedAdMasters++;
            }

            $campaignInsights = fetchAdDailyInsightsForDay(
                $config,
                $metaAdAccountId,
                $accessToken,
                $yesterdayDate,
                'campaign',
            );
            $adsetInsights = fetchAdDailyInsightsForDay(
                $config,
                $metaAdAccountId,
                $accessToken,
                $yesterdayDate,
                'adset',
            );
            $adInsights = fetchAdDailyInsightsForDay(
                $config,
                $metaAdAccountId,
                $accessToken,
                $yesterdayDate,
                'ad',
            );

            $syncedCampaignRows = 0;
            $syncedAdsetRows = 0;
            $syncedAdRows = 0;

            foreach ($campaignInsights as $insight) {
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
                if (!hasAdDeliveryMetrics($insight)) {
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
                $syncedCampaignRows++;
            }

            foreach ($adsetInsights as $insight) {
                if (!is_array($insight)) {
                    continue;
                }

                $adsetId = is_string($insight['adset_id'] ?? null)
                    ? trim($insight['adset_id'])
                    : '';
                $campaignId = is_string($insight['campaign_id'] ?? null)
                    ? trim($insight['campaign_id'])
                    : '';
                $metricDate = is_string($insight['date_start'] ?? null)
                    ? trim($insight['date_start'])
                    : $yesterdayDate;
                if ($adsetId === '' || $campaignId === '') {
                    continue;
                }
                if (!hasAdDeliveryMetrics($insight)) {
                    continue;
                }

                $adsetName = is_string($insight['adset_name'] ?? null)
                    ? trim($insight['adset_name'])
                    : 'Unnamed ad set';
                if ($adsetName === '') {
                    $adsetName = 'Unnamed ad set';
                }

                upsertAdsetMetric($config, $accountId, [
                    'campaign_id' => $campaignId,
                    'adset_id' => $adsetId,
                    'adset_name' => $adsetName,
                    'metric_date' => $metricDate,
                    'spend' => parseSpend($insight['spend'] ?? 0),
                    'impressions' => parseMetricValue($insight['impressions'] ?? 0),
                    'reach' => parseMetricValue($insight['reach'] ?? 0),
                    'clicks' => parseMetricValue($insight['clicks'] ?? 0),
                    'cpm' => parseDecimal($insight['cpm'] ?? 0),
                    'frequency' => parseDecimal($insight['frequency'] ?? 0),
                    'conversions' => parseInsightConversions($insight),
                ]);
                $syncedAdsetRows++;
            }

            foreach ($adInsights as $insight) {
                if (!is_array($insight)) {
                    continue;
                }

                $adId = is_string($insight['ad_id'] ?? null)
                    ? trim($insight['ad_id'])
                    : '';
                $adsetId = is_string($insight['adset_id'] ?? null)
                    ? trim($insight['adset_id'])
                    : '';
                $campaignId = is_string($insight['campaign_id'] ?? null)
                    ? trim($insight['campaign_id'])
                    : '';
                $metricDate = is_string($insight['date_start'] ?? null)
                    ? trim($insight['date_start'])
                    : $yesterdayDate;
                if ($adId === '' || $adsetId === '' || $campaignId === '') {
                    continue;
                }
                if (!hasAdDeliveryMetrics($insight)) {
                    continue;
                }

                $adName = is_string($insight['ad_name'] ?? null)
                    ? trim($insight['ad_name'])
                    : 'Unnamed ad';
                if ($adName === '') {
                    $adName = 'Unnamed ad';
                }

                upsertAdMetric($config, $accountId, [
                    'campaign_id' => $campaignId,
                    'adset_id' => $adsetId,
                    'ad_id' => $adId,
                    'ad_name' => $adName,
                    'metric_date' => $metricDate,
                    'spend' => parseSpend($insight['spend'] ?? 0),
                    'impressions' => parseMetricValue($insight['impressions'] ?? 0),
                    'reach' => parseMetricValue($insight['reach'] ?? 0),
                    'clicks' => parseMetricValue($insight['clicks'] ?? 0),
                    'cpm' => parseDecimal($insight['cpm'] ?? 0),
                    'frequency' => parseDecimal($insight['frequency'] ?? 0),
                    'conversions' => parseInsightConversions($insight),
                ]);
                $syncedAdRows++;
            }

            logLine(
                'Done ' . $accountName
                . ': campaign_rows=' . $syncedCampaignRows
                . ' adset_masters=' . $syncedAdsetMasters
                . ' ad_masters=' . $syncedAdMasters
                . ' adset_rows=' . $syncedAdsetRows
                . ' ad_rows=' . $syncedAdRows,
            );
        } catch (Throwable $error) {
            logLine('Error for ' . $accountName . ': ' . $error->getMessage());
        }
    }

    logLine('Ad sync complete.');
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
