<?php

declare(strict_types=1);

/**
 * One-off diagnostic: which local-action GAQL fields return data?
 * Usage: php _diag_local_actions.php [days]
 */

require_once __DIR__ . '/lib/supabase.php';
require_once __DIR__ . '/lib/meta.php';
require_once __DIR__ . '/lib/google_ads.php';

$config = loadConfig();
$days = isset($argv[1]) ? max(1, (int) $argv[1]) : 90;
$tz = new DateTimeZone($config['timezone'] ?? 'UTC');
$yesterday = new DateTimeImmutable('yesterday', $tz);
$toDate = $yesterday->format('Y-m-d');
$fromDate = $yesterday->modify('-' . ($days - 1) . ' days')->format('Y-m-d');
$dateFilter = googleAdsDateFilter($fromDate, $toDate);

$accounts = fetchAdAccounts($config);
$account = null;
foreach ($accounts as $row) {
    if (is_array($row) && ($row['platform'] ?? '') === 'google_ads') {
        $account = $row;
        break;
    }
}
if ($account === null) {
    fwrite(STDERR, "No google_ads account\n");
    exit(1);
}

$customerId = normalizeGoogleCustomerIdPhp((string) ($account['ad_account_id'] ?? ''));
$managerId = normalizeGoogleCustomerIdPhp((string) ($account['manager_id'] ?? ''));
$developerToken = trim((string) ($account['developer_token'] ?? ''));
if ($developerToken === '' || strtoupper($developerToken) === 'UNUSED') {
    $developerToken = 'UNUSED';
}
$accessToken = googleAdsExchangeAccessToken(
    trim((string) $account['oauth_client_id']),
    trim((string) $account['oauth_client_secret']),
    trim((string) $account['oauth_refresh_token']),
);

echo "Account: {$account['account_name']} customer={$customerId} range={$fromDate}..{$toDate}\n\n";

$channelQuery = 'SELECT campaign.id, campaign.name, campaign.advertising_channel_type, '
    . 'metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions '
    . 'FROM campaign WHERE ' . $dateFilter;

$campaigns = googleAdsSearch(
    $config,
    $customerId,
    $managerId,
    $developerToken,
    $accessToken,
    $channelQuery,
);

$byCampaign = [];
foreach ($campaigns as $row) {
    $id = (string) ($row['campaign']['id'] ?? '');
    $name = (string) ($row['campaign']['name'] ?? '');
    $ch = (string) ($row['campaign']['advertisingChannelType']
        ?? $row['campaign']['advertising_channel_type']
        ?? '');
    if ($id === '') {
        continue;
    }
    if (!isset($byCampaign[$id])) {
        $byCampaign[$id] = [
            'name' => $name,
            'channel' => $ch,
            'impressions' => 0,
            'clicks' => 0,
            'conversions' => 0.0,
        ];
    }
    $m = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
    $byCampaign[$id]['impressions'] += (int) parseMetricValue($m['impressions'] ?? 0);
    $byCampaign[$id]['clicks'] += (int) parseMetricValue($m['clicks'] ?? 0);
    $byCampaign[$id]['conversions'] += (float) ($m['conversions'] ?? 0);
}

echo "Campaigns with delivery:\n";
foreach ($byCampaign as $id => $c) {
    echo "  {$id} [{$c['channel']}] {$c['name']} impr={$c['impressions']} clicks={$c['clicks']} conv={$c['conversions']}\n";
}
echo "\n";

$queries = [
    'feed' => 'SELECT campaign.id, campaign.name, campaign.advertising_channel_type, segments.date, '
        . 'metrics.all_conversions_from_store_visit, '
        . 'metrics.all_conversions_from_store_website, '
        . 'metrics.all_conversions_from_directions, '
        . 'metrics.all_conversions_from_click_to_call, '
        . 'metrics.all_conversions_from_order, '
        . 'metrics.all_conversions_from_menu, '
        . 'metrics.all_conversions_from_other_engagement '
        . 'FROM campaign WHERE ' . $dateFilter,
    'location_asset' => 'SELECT campaign.id, campaign.name, campaign.advertising_channel_type, segments.date, '
        . 'metrics.all_conversions_from_location_asset_store_visits, '
        . 'metrics.all_conversions_from_location_asset_website, '
        . 'metrics.all_conversions_from_location_asset_directions, '
        . 'metrics.all_conversions_from_location_asset_click_to_call, '
        . 'metrics.all_conversions_from_location_asset_order, '
        . 'metrics.all_conversions_from_location_asset_menu, '
        . 'metrics.all_conversions_from_location_asset_other_engagement '
        . 'FROM campaign WHERE ' . $dateFilter,
    'conv_segment' => 'SELECT campaign.id, campaign.name, segments.conversion_action_name, '
        . 'segments.conversion_action_category, metrics.all_conversions '
        . 'FROM campaign WHERE ' . $dateFilter
        . ' AND metrics.all_conversions > 0',
];

foreach ($queries as $label => $query) {
    echo "=== {$label} ===\n";
    try {
        $rows = googleAdsSearch(
            $config,
            $customerId,
            $managerId,
            $developerToken,
            $accessToken,
            $query,
        );
        echo 'rows=' . count($rows) . "\n";

        if ($label === 'conv_segment') {
            $totals = [];
            foreach ($rows as $row) {
                $name = (string) ($row['segments']['conversionActionName']
                    ?? $row['segments']['conversion_action_name']
                    ?? '?');
                $cat = (string) ($row['segments']['conversionActionCategory']
                    ?? $row['segments']['conversion_action_category']
                    ?? '?');
                $key = $cat . ' | ' . $name;
                $val = (float) ($row['metrics']['allConversions']
                    ?? $row['metrics']['all_conversions']
                    ?? 0);
                $totals[$key] = ($totals[$key] ?? 0) + $val;
            }
            arsort($totals);
            $i = 0;
            foreach ($totals as $key => $val) {
                echo '  ' . round($val, 2) . "  {$key}\n";
                if (++$i >= 40) {
                    break;
                }
            }
        } else {
            $sums = [];
            $sampleKeys = [];
            foreach ($rows as $row) {
                $m = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
                if ($sampleKeys === [] && $m !== []) {
                    $sampleKeys = array_keys($m);
                }
                foreach ($m as $k => $v) {
                    $sums[$k] = ($sums[$k] ?? 0) + (float) $v;
                }
            }
            echo 'metric keys sample: ' . implode(', ', $sampleKeys) . "\n";
            foreach ($sums as $k => $v) {
                echo '  ' . $k . '=' . round($v, 4) . "\n";
            }
        }
    } catch (Throwable $e) {
        echo 'ERROR: ' . $e->getMessage() . "\n";
    }
    echo "\n";
}
