<?php

declare(strict_types=1);

/**
 * Google Ads API helpers for midnight Growth ads sync (server-side; no CORS).
 * Maps Google campaign / ad_group / ad_group_ad → Digi Carotene campaign / adset / ad tables.
 *
 * @see https://developers.google.com/google-ads/api/rest/auth
 */

require_once __DIR__ . '/supabase.php';
require_once __DIR__ . '/meta.php'; // parseSpend / parseMetricValue helpers + shared metric shape
require_once __DIR__ . '/google_ads_matrix.php';

function normalizeGoogleCustomerIdPhp(string $raw): string
{
    return preg_replace('/[-\s]/', '', trim($raw)) ?? '';
}

function googleAdsApiVersion(array $config): string
{
    $version = trim((string) ($config['google_ads_api_version'] ?? 'v19'));

    return $version !== '' ? $version : 'v19';
}

function googleAdsExchangeAccessToken(
    string $clientId,
    string $clientSecret,
    string $refreshToken,
): string {
    $ch = curl_init('https://oauth2.googleapis.com/token');
    if ($ch === false) {
        throw new RuntimeException('curl_init failed for Google OAuth');
    }

    $body = http_build_query([
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'refresh_token' => $refreshToken,
        'grant_type' => 'refresh_token',
    ]);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_TIMEOUT => 60,
    ]);

    $raw = curl_exec($ch);
    if ($raw === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('Google OAuth request failed: ' . $error);
    }

    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    /** @var array $json */
    $json = json_decode($raw, true) ?? [];
    $token = is_string($json['access_token'] ?? null) ? $json['access_token'] : '';

    if ($status >= 400 || $token === '') {
        $message = is_string($json['error_description'] ?? null)
            ? $json['error_description']
            : (is_string($json['error'] ?? null) ? $json['error'] : 'Google OAuth HTTP ' . $status);
        throw new RuntimeException($message);
    }

    return $token;
}

/**
 * GAQL search with pageToken pagination.
 *
 * @return list<array<string, mixed>>
 */
function googleAdsSearch(
    array $config,
    string $customerId,
    string $managerId,
    string $developerToken,
    string $accessToken,
    string $query,
): array {
    $customerId = normalizeGoogleCustomerIdPhp($customerId);
    $managerId = normalizeGoogleCustomerIdPhp($managerId);
    $version = googleAdsApiVersion($config);
    $url = 'https://googleads.googleapis.com/' . $version
        . '/customers/' . rawurlencode($customerId) . '/googleAds:search';

    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'developer-token: ' . $developerToken,
        // Google Ads API header name; Digi stores this as manager_id.
        'login-customer-id: ' . $managerId,
    ];

    $results = [];
    $pageToken = null;

    do {
        $body = ['query' => $query];
        if (is_string($pageToken) && $pageToken !== '') {
            $body['pageToken'] = $pageToken;
        }

        $json = httpJson('POST', $url, $body, $headers);
        $page = $json['results'] ?? [];
        if (is_array($page)) {
            foreach ($page as $row) {
                if (is_array($row)) {
                    $results[] = $row;
                }
            }
        }

        $pageToken = is_string($json['nextPageToken'] ?? null)
            ? $json['nextPageToken']
            : null;
    } while ($pageToken !== null && $pageToken !== '');

    return $results;
}

function mapGoogleCampaignStatus(?string $status): string
{
    $normalized = strtoupper(trim((string) $status));
    if ($normalized === 'ENABLED') {
        return 'Active';
    }
    if ($normalized === 'PAUSED') {
        return 'Paused';
    }

    return 'Completed';
}

function googleAdsMicrosToCurrency(mixed $micros): float
{
    return round(((float) ($micros ?? 0)) / 1_000_000, 2);
}

function googleAdsRowHasDelivery(array $metrics): bool
{
    $spend = googleAdsMicrosToCurrency($metrics['costMicros'] ?? 0);
    $impressions = parseMetricValue($metrics['impressions'] ?? 0);
    $clicks = parseMetricValue($metrics['clicks'] ?? 0);

    return $spend > 0 || $impressions > 0 || $clicks > 0;
}

function googleAdsCpm(array $metrics): float
{
    if (isset($metrics['averageCpm'])) {
        return googleAdsMicrosToCurrency($metrics['averageCpm']);
    }

    $impressions = parseMetricValue($metrics['impressions'] ?? 0);
    $spend = googleAdsMicrosToCurrency($metrics['costMicros'] ?? 0);
    if ($impressions <= 0) {
        return 0.0;
    }

    return round(($spend / $impressions) * 1000, 2);
}

function googleAdsDateFilter(string $fromDate, string $toDate): string
{
    if ($fromDate === $toDate) {
        return "segments.date = '" . $fromDate . "'";
    }

    return "segments.date BETWEEN '" . $fromDate . "' AND '" . $toDate . "'";
}

/**
 * Build universal + type-specific campaign metric payload from a GAQL row.
 *
 * @param array<string, mixed> $row
 * @return array<string, mixed>|null
 */
function googleAdsBuildCampaignMetricRow(array $row, string $fallbackDate): ?array
{
    $metrics = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
    if (!googleAdsRowHasDelivery($metrics)) {
        return null;
    }

    $campaignId = (string) ($row['campaign']['id'] ?? '');
    if ($campaignId === '') {
        return null;
    }

    $campaignName = trim((string) ($row['campaign']['name'] ?? ''));
    if ($campaignName === '') {
        $campaignName = 'Unnamed campaign';
    }

    $metricDate = trim((string) ($row['segments']['date'] ?? $fallbackDate));
    $channel = $row['campaign']['advertisingChannelType']
        ?? $row['campaign']['advertising_channel_type']
        ?? null;
    $objective = is_string($channel) && $channel !== '' ? $channel : null;

    $costRaw = googleAdsMetricGet($metrics, 'costMicros', 'cost_micros') ?? 0;
    $spend = googleAdsMicrosToCurrency($costRaw);
    $impressions = parseMetricValue(googleAdsMetricGet($metrics, 'impressions') ?? 0);
    $clicks = parseMetricValue(googleAdsMetricGet($metrics, 'clicks') ?? 0);
    $conversions = (float) (googleAdsMetricGet($metrics, 'conversions') ?? 0);
    $conversionValue = (float) (googleAdsMetricGet($metrics, 'conversionsValue', 'conversions_value') ?? 0);

    $payload = [
        'campaign_id' => $campaignId,
        'campaign_name' => $campaignName,
        'status' => mapGoogleCampaignStatus(
            is_string($row['campaign']['status'] ?? null) ? $row['campaign']['status'] : null,
        ),
        'objective' => $objective,
        'metric_date' => $metricDate !== '' ? $metricDate : $fallbackDate,
        'spend' => $spend,
        'impressions' => $impressions,
        'reach' => $impressions,
        'clicks' => $clicks,
        'cpm' => googleAdsCpm($metrics),
        'frequency' => 0.0,
        'conversions' => (int) round($conversions),
        'conversion_value' => round($conversionValue, 2),
        'search_impression_share' => null,
        'search_budget_lost_impression_share' => null,
        'search_rank_lost_impression_share' => null,
        'active_view_viewability' => null,
        'video_views' => 0,
        'average_cpv' => null,
        'video_quartile_p25_rate' => null,
        'video_quartile_p50_rate' => null,
        'video_quartile_p75_rate' => null,
        'video_quartile_p100_rate' => null,
        '_type' => googleAdsResolveCampaignType(is_string($objective) ? $objective : null),
    ];

    return $payload;
}

/**
 * Merge type-specific extras from a GAQL metrics row into an existing payload.
 *
 * @param array<string, mixed> $payload
 * @param array<string, mixed> $metrics
 * @return array<string, mixed>
 */
function googleAdsMergeTypeExtras(array $payload, array $metrics, string $typeId): array
{
    if ($typeId === 'search' || $typeId === 'shopping') {
        $payload['search_impression_share'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'searchImpressionShare', 'search_impression_share'),
        );
    }
    if ($typeId === 'search') {
        $payload['search_budget_lost_impression_share'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'searchBudgetLostImpressionShare', 'search_budget_lost_impression_share'),
        );
        $payload['search_rank_lost_impression_share'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'searchRankLostImpressionShare', 'search_rank_lost_impression_share'),
        );
    }
    if ($typeId === 'display') {
        $payload['active_view_viewability'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'activeViewViewability', 'active_view_viewability'),
        );
    }
    if (in_array($typeId, ['display', 'demand_gen', 'video'], true)) {
        $payload['cpm'] = googleAdsCpm($metrics);
    }
    if ($typeId === 'video') {
        $payload['video_views'] = (int) parseMetricValue(
            googleAdsMetricGet($metrics, 'videoViews', 'video_views') ?? 0,
        );
        $cpvRaw = googleAdsMetricGet($metrics, 'averageCpv', 'average_cpv');
        $payload['average_cpv'] = $cpvRaw !== null ? googleAdsMicrosToCurrency($cpvRaw) : null;
        $payload['video_quartile_p25_rate'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'videoQuartileP25Rate', 'video_quartile_p25_rate'),
        );
        $payload['video_quartile_p50_rate'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'videoQuartileP50Rate', 'video_quartile_p50_rate'),
        );
        $payload['video_quartile_p75_rate'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'videoQuartileP75Rate', 'video_quartile_p75_rate'),
        );
        $payload['video_quartile_p100_rate'] = googleAdsShareToFloat(
            googleAdsMetricGet($metrics, 'videoQuartileP100Rate', 'video_quartile_p100_rate'),
        );
    }

    return $payload;
}

/**
 * Sync one Google ad account for a date range (inclusive).
 * Universal Phase 1 metrics for all campaigns, then type-specific enrichment.
 *
 * @param array<string, mixed> $account growth_ad_accounts row
 */
function syncGoogleAdAccountForDateRange(
    array $config,
    array $account,
    string $fromDate,
    string $toDate,
): void {
    $accountId = (string) ($account['id'] ?? '');
    $customerId = normalizeGoogleCustomerIdPhp((string) ($account['ad_account_id'] ?? ''));
    $managerId = normalizeGoogleCustomerIdPhp((string) ($account['manager_id'] ?? ''));
    $developerToken = trim((string) ($account['developer_token'] ?? ''));
    if ($developerToken === '' || strtoupper($developerToken) === 'UNUSED') {
        $developerToken = 'UNUSED';
    }
    $oauthClientId = trim((string) ($account['oauth_client_id'] ?? ''));
    $oauthClientSecret = trim((string) ($account['oauth_client_secret'] ?? ''));
    $oauthRefreshToken = trim((string) ($account['oauth_refresh_token'] ?? ''));
    $accountName = (string) ($account['account_name'] ?? '');

    if (
        $accountId === ''
        || $customerId === ''
        || $managerId === ''
        || $oauthClientId === ''
        || $oauthClientSecret === ''
        || $oauthRefreshToken === ''
    ) {
        throw new RuntimeException(
            'Missing Google Ads credentials (customer id, manager id, or OAuth).',
        );
    }

    $accessToken = googleAdsExchangeAccessToken(
        $oauthClientId,
        $oauthClientSecret,
        $oauthRefreshToken,
    );

    $dateFilter = googleAdsDateFilter($fromDate, $toDate);

    // Masters (structure) — Google ad_group ≈ Meta ad set; ad_group_ad ≈ Meta ad.
    $adGroupMasters = googleAdsSearch(
        $config,
        $customerId,
        $managerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, ad_group.id, ad_group.name '
        . 'FROM ad_group WHERE ad_group.status != \'REMOVED\'',
    );

    $adMasters = googleAdsSearch(
        $config,
        $customerId,
        $managerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, ad_group.id, ad_group_ad.ad.id, ad_group_ad.ad.name '
        . 'FROM ad_group_ad WHERE ad_group_ad.status != \'REMOVED\'',
    );

    $syncedAdsetMasters = 0;
    $syncedAdMasters = 0;

    foreach ($adGroupMasters as $row) {
        $campaignId = (string) ($row['campaign']['id'] ?? '');
        $adsetId = (string) ($row['adGroup']['id'] ?? '');
        $adsetName = trim((string) ($row['adGroup']['name'] ?? ''));
        if ($campaignId === '' || $adsetId === '') {
            continue;
        }
        if ($adsetName === '') {
            $adsetName = 'Unnamed ad group';
        }

        upsertAdsetMaster($config, $accountId, [
            'campaign_id' => $campaignId,
            'adset_id' => $adsetId,
            'adset_name' => $adsetName,
            'performance_goal' => null,
            'location_summary' => null,
            'age_summary' => null,
            'custom_targeting_summary' => null,
            'detailed_targeting_summary' => null,
            'placements_summary' => null,
        ]);
        $syncedAdsetMasters++;
    }

    foreach ($adMasters as $row) {
        $campaignId = (string) ($row['campaign']['id'] ?? '');
        $adsetId = (string) ($row['adGroup']['id'] ?? '');
        $adId = (string) ($row['adGroupAd']['ad']['id'] ?? '');
        $adName = trim((string) ($row['adGroupAd']['ad']['name'] ?? ''));
        if ($campaignId === '' || $adsetId === '' || $adId === '') {
            continue;
        }
        if ($adName === '') {
            $adName = 'Unnamed ad';
        }

        upsertAdMaster($config, $accountId, [
            'campaign_id' => $campaignId,
            'adset_id' => $adsetId,
            'ad_id' => $adId,
            'ad_name' => $adName,
            'thumbnail_url' => null,
            'primary_text' => null,
            'headline' => null,
        ]);
        $syncedAdMasters++;
    }

    // ── Universal Phase 1 campaign metrics ─────────────────────────────────
    $campaignRows = googleAdsSearch(
        $config,
        $customerId,
        $managerId,
        $developerToken,
        $accessToken,
        'SELECT ' . googleAdsUniversalCampaignSelect()
        . ' FROM campaign WHERE ' . $dateFilter,
    );

    /** @var array<string, array<string, mixed>> $campaignByKey */
    $campaignByKey = [];
    foreach ($campaignRows as $row) {
        $payload = googleAdsBuildCampaignMetricRow($row, $toDate);
        if ($payload === null) {
            continue;
        }
        $key = $payload['campaign_id'] . '|' . $payload['metric_date'];
        $campaignByKey[$key] = $payload;
    }

    // ── Type-specific campaign extras (separate GAQL — incompatible fields) ─
    foreach (googleAdsTypesWithCampaignExtras() as $typeId) {
        $extraSelect = googleAdsTypeExtraCampaignSelect($typeId);
        $channels = googleAdsChannelTypesForDigiType($typeId);
        if ($extraSelect === '' || $channels === []) {
            continue;
        }

        $channelList = implode(', ', array_map(
            static fn (string $c): string => "'" . $c . "'",
            $channels,
        ));

        try {
            $extraRows = googleAdsSearch(
                $config,
                $customerId,
                $managerId,
                $developerToken,
                $accessToken,
                'SELECT campaign.id, segments.date, ' . $extraSelect
                . ' FROM campaign WHERE ' . $dateFilter
                . ' AND campaign.advertisingChannelType IN (' . $channelList . ')',
            );
        } catch (Throwable $e) {
            logLine('Google type extras skipped for ' . $typeId . ': ' . $e->getMessage());
            continue;
        }

        foreach ($extraRows as $row) {
            $campaignId = (string) ($row['campaign']['id'] ?? '');
            $metricDate = trim((string) ($row['segments']['date'] ?? $toDate));
            if ($campaignId === '') {
                continue;
            }
            $key = $campaignId . '|' . ($metricDate !== '' ? $metricDate : $toDate);
            if (!isset($campaignByKey[$key])) {
                continue;
            }
            $metrics = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
            $campaignByKey[$key] = googleAdsMergeTypeExtras(
                $campaignByKey[$key],
                $metrics,
                $typeId,
            );
        }
    }

    $syncedCampaignRows = 0;
    foreach ($campaignByKey as $payload) {
        unset($payload['_type']);
        upsertAdCampaignMetric($config, $accountId, $payload);
        $syncedCampaignRows++;
    }

    // ── Ad group + ad daily (universal) ────────────────────────────────────
    $adGroupRows = googleAdsSearch(
        $config,
        $customerId,
        $managerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, ad_group.id, ad_group.name, segments.date, '
        . 'metrics.impressions, metrics.clicks, metrics.costMicros, '
        . 'metrics.conversions, metrics.averageCpm '
        . 'FROM ad_group WHERE ' . $dateFilter,
    );

    $adRows = googleAdsSearch(
        $config,
        $customerId,
        $managerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, ad_group.id, ad_group_ad.ad.id, ad_group_ad.ad.name, segments.date, '
        . 'metrics.impressions, metrics.clicks, metrics.costMicros, '
        . 'metrics.conversions, metrics.averageCpm '
        . 'FROM ad_group_ad WHERE ' . $dateFilter,
    );

    $syncedAdsetRows = 0;
    $syncedAdRows = 0;

    foreach ($adGroupRows as $row) {
        $metrics = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
        if (!googleAdsRowHasDelivery($metrics)) {
            continue;
        }

        $campaignId = (string) ($row['campaign']['id'] ?? '');
        $adsetId = (string) ($row['adGroup']['id'] ?? '');
        if ($campaignId === '' || $adsetId === '') {
            continue;
        }

        $adsetName = trim((string) ($row['adGroup']['name'] ?? ''));
        if ($adsetName === '') {
            $adsetName = 'Unnamed ad group';
        }

        $metricDate = trim((string) ($row['segments']['date'] ?? $toDate));
        $spend = googleAdsMicrosToCurrency(googleAdsMetricGet($metrics, 'costMicros', 'cost_micros') ?? 0);
        $impressions = parseMetricValue(googleAdsMetricGet($metrics, 'impressions') ?? 0);
        $clicks = parseMetricValue(googleAdsMetricGet($metrics, 'clicks') ?? 0);
        $conversions = (int) round((float) (googleAdsMetricGet($metrics, 'conversions') ?? 0));

        upsertAdsetMetric($config, $accountId, [
            'campaign_id' => $campaignId,
            'adset_id' => $adsetId,
            'adset_name' => $adsetName,
            'metric_date' => $metricDate !== '' ? $metricDate : $toDate,
            'spend' => $spend,
            'impressions' => $impressions,
            'reach' => $impressions,
            'clicks' => $clicks,
            'cpm' => googleAdsCpm($metrics),
            'frequency' => 0.0,
            'conversions' => $conversions,
        ]);
        $syncedAdsetRows++;
    }

    foreach ($adRows as $row) {
        $metrics = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
        if (!googleAdsRowHasDelivery($metrics)) {
            continue;
        }

        $campaignId = (string) ($row['campaign']['id'] ?? '');
        $adsetId = (string) ($row['adGroup']['id'] ?? '');
        $adId = (string) ($row['adGroupAd']['ad']['id'] ?? '');
        if ($campaignId === '' || $adsetId === '' || $adId === '') {
            continue;
        }

        $adName = trim((string) ($row['adGroupAd']['ad']['name'] ?? ''));
        if ($adName === '') {
            $adName = 'Unnamed ad';
        }

        $metricDate = trim((string) ($row['segments']['date'] ?? $toDate));
        $spend = googleAdsMicrosToCurrency(googleAdsMetricGet($metrics, 'costMicros', 'cost_micros') ?? 0);
        $impressions = parseMetricValue(googleAdsMetricGet($metrics, 'impressions') ?? 0);
        $clicks = parseMetricValue(googleAdsMetricGet($metrics, 'clicks') ?? 0);
        $conversions = (int) round((float) (googleAdsMetricGet($metrics, 'conversions') ?? 0));

        upsertAdMetric($config, $accountId, [
            'campaign_id' => $campaignId,
            'adset_id' => $adsetId,
            'ad_id' => $adId,
            'ad_name' => $adName,
            'metric_date' => $metricDate !== '' ? $metricDate : $toDate,
            'spend' => $spend,
            'impressions' => $impressions,
            'reach' => $impressions,
            'clicks' => $clicks,
            'cpm' => googleAdsCpm($metrics),
            'frequency' => 0.0,
            'conversions' => $conversions,
        ]);
        $syncedAdRows++;
    }

    // ── Performance Max asset groups (Phase 2) ─────────────────────────────
    $syncedAssetGroupRows = 0;
    try {
        $assetGroupRows = googleAdsSearch(
            $config,
            $customerId,
            $managerId,
            $developerToken,
            $accessToken,
            'SELECT campaign.id, asset_group.id, asset_group.name, segments.date, '
            . 'segments.adNetworkType, metrics.impressions, metrics.clicks, '
            . 'metrics.costMicros, metrics.conversions, metrics.conversionsValue '
            . 'FROM asset_group WHERE ' . $dateFilter
            . ' AND campaign.advertisingChannelType = \'PERFORMANCE_MAX\'',
        );

        foreach ($assetGroupRows as $row) {
            $metrics = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
            $campaignId = (string) ($row['campaign']['id'] ?? '');
            $assetGroupId = (string) ($row['assetGroup']['id'] ?? $row['asset_group']['id'] ?? '');
            if ($campaignId === '' || $assetGroupId === '') {
                continue;
            }
            if (!googleAdsRowHasDelivery($metrics) && (float) (googleAdsMetricGet($metrics, 'conversions') ?? 0) <= 0) {
                continue;
            }

            $metricDate = trim((string) ($row['segments']['date'] ?? $toDate));
            $network = (string) (
                $row['segments']['adNetworkType']
                ?? $row['segments']['ad_network_type']
                ?? 'UNSPECIFIED'
            );

            upsertGoogleAssetGroupMetric($config, $accountId, [
                'campaign_id' => $campaignId,
                'asset_group_id' => $assetGroupId,
                'asset_group_name' => trim((string) ($row['assetGroup']['name'] ?? $row['asset_group']['name'] ?? '')),
                'metric_date' => $metricDate !== '' ? $metricDate : $toDate,
                'ad_network_type' => $network !== '' ? $network : 'UNSPECIFIED',
                'spend' => googleAdsMicrosToCurrency(googleAdsMetricGet($metrics, 'costMicros', 'cost_micros') ?? 0),
                'impressions' => parseMetricValue(googleAdsMetricGet($metrics, 'impressions') ?? 0),
                'clicks' => parseMetricValue(googleAdsMetricGet($metrics, 'clicks') ?? 0),
                'conversions' => (float) (googleAdsMetricGet($metrics, 'conversions') ?? 0),
                'conversion_value' => round((float) (googleAdsMetricGet($metrics, 'conversionsValue', 'conversions_value') ?? 0), 2),
            ]);
            $syncedAssetGroupRows++;
        }
    } catch (Throwable $e) {
        logLine('Google asset_group sync skipped: ' . $e->getMessage());
    }

    // ── Call view (Phase 3 — Local / Call) ─────────────────────────────────
    $syncedCallRows = 0;
    try {
        $callRows = googleAdsSearch(
            $config,
            $customerId,
            $managerId,
            $developerToken,
            $accessToken,
            'SELECT campaign.id, call_view.resourceName, call_view.startCallDateTime, '
            . 'call_view.endCallDateTime, call_view.callDurationSeconds, call_view.callStatus, '
            . 'call_view.callerAreaCode, call_view.callerCountryCode, '
            . 'call_view.callTrackingDisplayLocation '
            . 'FROM call_view WHERE campaign.advertisingChannelType IN '
            . "('LOCAL', 'LOCAL_SERVICES', 'SMART', 'SEARCH')",
        );

        foreach ($callRows as $row) {
            $campaignId = (string) ($row['campaign']['id'] ?? '');
            $callView = is_array($row['callView'] ?? null)
                ? $row['callView']
                : (is_array($row['call_view'] ?? null) ? $row['call_view'] : []);
            $resourceName = (string) (
                $callView['resourceName']
                ?? $callView['resource_name']
                ?? ''
            );
            if ($campaignId === '' || $resourceName === '') {
                continue;
            }

            $startAt = $callView['startCallDateTime'] ?? $callView['start_call_date_time'] ?? null;
            $metricDate = null;
            if (is_string($startAt) && strlen($startAt) >= 10) {
                $metricDate = substr($startAt, 0, 10);
            }

            upsertGoogleCallMetric($config, $accountId, [
                'campaign_id' => $campaignId,
                'call_resource_name' => $resourceName,
                'start_call_at' => is_string($startAt) ? $startAt : null,
                'end_call_at' => is_string($callView['endCallDateTime'] ?? $callView['end_call_date_time'] ?? null)
                    ? ($callView['endCallDateTime'] ?? $callView['end_call_date_time'])
                    : null,
                'call_duration_seconds' => isset($callView['callDurationSeconds'])
                    ? (int) $callView['callDurationSeconds']
                    : (isset($callView['call_duration_seconds']) ? (int) $callView['call_duration_seconds'] : null),
                'call_status' => is_string($callView['callStatus'] ?? $callView['call_status'] ?? null)
                    ? ($callView['callStatus'] ?? $callView['call_status'])
                    : null,
                'caller_area_code' => is_string($callView['callerAreaCode'] ?? $callView['caller_area_code'] ?? null)
                    ? ($callView['callerAreaCode'] ?? $callView['caller_area_code'])
                    : null,
                'caller_country_code' => is_string($callView['callerCountryCode'] ?? $callView['caller_country_code'] ?? null)
                    ? ($callView['callerCountryCode'] ?? $callView['caller_country_code'])
                    : null,
                'call_tracking_display_location' => is_string(
                    $callView['callTrackingDisplayLocation']
                    ?? $callView['call_tracking_display_location']
                    ?? null,
                )
                    ? ($callView['callTrackingDisplayLocation'] ?? $callView['call_tracking_display_location'])
                    : null,
                'metric_date' => $metricDate,
            ]);
            $syncedCallRows++;
        }
    } catch (Throwable $e) {
        logLine('Google call_view sync skipped: ' . $e->getMessage());
    }

    logLine(
        'Done ' . $accountName
        . ' [google_ads]: range=' . $fromDate . '..' . $toDate
        . ' campaign_rows=' . $syncedCampaignRows
        . ' adset_masters=' . $syncedAdsetMasters
        . ' ad_masters=' . $syncedAdMasters
        . ' adset_rows=' . $syncedAdsetRows
        . ' ad_rows=' . $syncedAdRows
        . ' asset_group_rows=' . $syncedAssetGroupRows
        . ' call_rows=' . $syncedCallRows,
    );
}

/**
 * Sync one Google ad account for a single calendar day.
 *
 * @param array<string, mixed> $account growth_ad_accounts row
 */
function syncGoogleAdAccountYesterday(array $config, array $account, string $yesterdayDate): void
{
    syncGoogleAdAccountForDateRange($config, $account, $yesterdayDate, $yesterdayDate);
}
