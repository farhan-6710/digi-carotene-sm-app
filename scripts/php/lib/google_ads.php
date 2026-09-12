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
    string $loginCustomerId,
    string $developerToken,
    string $accessToken,
    string $query,
): array {
    $customerId = normalizeGoogleCustomerIdPhp($customerId);
    $loginCustomerId = normalizeGoogleCustomerIdPhp($loginCustomerId);
    $version = googleAdsApiVersion($config);
    $url = 'https://googleads.googleapis.com/' . $version
        . '/customers/' . rawurlencode($customerId) . '/googleAds:search';

    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'developer-token: ' . $developerToken,
        'login-customer-id: ' . $loginCustomerId,
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

/**
 * Sync one Google Ads account for a single calendar day into the shared ads tables.
 *
 * @param array<string, mixed> $account growth_ads_accounts row
 */
function syncGoogleAdAccountYesterday(array $config, array $account, string $yesterdayDate): void
{
    $accountId = (string) ($account['id'] ?? '');
    $customerId = normalizeGoogleCustomerIdPhp((string) ($account['ad_account_id'] ?? ''));
    $loginCustomerId = normalizeGoogleCustomerIdPhp((string) ($account['login_customer_id'] ?? ''));
    $developerToken = trim((string) ($account['developer_token'] ?? ''));
    $oauthClientId = trim((string) ($account['oauth_client_id'] ?? ''));
    $oauthClientSecret = trim((string) ($account['oauth_client_secret'] ?? ''));
    $oauthRefreshToken = trim((string) ($account['oauth_refresh_token'] ?? ''));
    $accountName = (string) ($account['account_name'] ?? '');

    if (
        $accountId === ''
        || $customerId === ''
        || $loginCustomerId === ''
        || $developerToken === ''
        || $oauthClientId === ''
        || $oauthClientSecret === ''
        || $oauthRefreshToken === ''
    ) {
        throw new RuntimeException(
            'Missing Google Ads credentials (customer id, login customer id, developer token, or OAuth).',
        );
    }

    $accessToken = googleAdsExchangeAccessToken(
        $oauthClientId,
        $oauthClientSecret,
        $oauthRefreshToken,
    );

    $dateFilter = "segments.date = '" . $yesterdayDate . "'";

    // Masters (structure) — Google ad_group ≈ Meta ad set; ad_group_ad ≈ Meta ad.
    $adGroupMasters = googleAdsSearch(
        $config,
        $customerId,
        $loginCustomerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, ad_group.id, ad_group.name '
        . 'FROM ad_group WHERE ad_group.status != \'REMOVED\'',
    );

    $adMasters = googleAdsSearch(
        $config,
        $customerId,
        $loginCustomerId,
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

    $campaignRows = googleAdsSearch(
        $config,
        $customerId,
        $loginCustomerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, campaign.name, campaign.status, campaign.advertisingChannelType, '
        . 'segments.date, metrics.impressions, metrics.clicks, metrics.costMicros, '
        . 'metrics.conversions, metrics.averageCpm '
        . 'FROM campaign WHERE ' . $dateFilter,
    );

    $adGroupRows = googleAdsSearch(
        $config,
        $customerId,
        $loginCustomerId,
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
        $loginCustomerId,
        $developerToken,
        $accessToken,
        'SELECT campaign.id, ad_group.id, ad_group_ad.ad.id, ad_group_ad.ad.name, segments.date, '
        . 'metrics.impressions, metrics.clicks, metrics.costMicros, '
        . 'metrics.conversions, metrics.averageCpm '
        . 'FROM ad_group_ad WHERE ' . $dateFilter,
    );

    $syncedCampaignRows = 0;
    $syncedAdsetRows = 0;
    $syncedAdRows = 0;

    foreach ($campaignRows as $row) {
        $metrics = is_array($row['metrics'] ?? null) ? $row['metrics'] : [];
        if (!googleAdsRowHasDelivery($metrics)) {
            continue;
        }

        $campaignId = (string) ($row['campaign']['id'] ?? '');
        if ($campaignId === '') {
            continue;
        }

        $campaignName = trim((string) ($row['campaign']['name'] ?? ''));
        if ($campaignName === '') {
            $campaignName = 'Unnamed campaign';
        }

        $metricDate = trim((string) ($row['segments']['date'] ?? $yesterdayDate));
        $channel = $row['campaign']['advertisingChannelType'] ?? null;
        $objective = is_string($channel) && $channel !== '' ? $channel : null;

        $spend = googleAdsMicrosToCurrency($metrics['costMicros'] ?? 0);
        $impressions = parseMetricValue($metrics['impressions'] ?? 0);
        $clicks = parseMetricValue($metrics['clicks'] ?? 0);
        $conversions = (int) round((float) ($metrics['conversions'] ?? 0));

        upsertAdCampaignMetric($config, $accountId, [
            'campaign_id' => $campaignId,
            'campaign_name' => $campaignName,
            'status' => mapGoogleCampaignStatus(
                is_string($row['campaign']['status'] ?? null) ? $row['campaign']['status'] : null,
            ),
            'objective' => $objective,
            'metric_date' => $metricDate !== '' ? $metricDate : $yesterdayDate,
            'spend' => $spend,
            'impressions' => $impressions,
            // Google does not expose Meta-style reach/frequency on these resources.
            'reach' => $impressions,
            'clicks' => $clicks,
            'cpm' => googleAdsCpm($metrics),
            'frequency' => 0.0,
            'conversions' => $conversions,
        ]);
        $syncedCampaignRows++;
    }

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

        $metricDate = trim((string) ($row['segments']['date'] ?? $yesterdayDate));
        $spend = googleAdsMicrosToCurrency($metrics['costMicros'] ?? 0);
        $impressions = parseMetricValue($metrics['impressions'] ?? 0);
        $clicks = parseMetricValue($metrics['clicks'] ?? 0);
        $conversions = (int) round((float) ($metrics['conversions'] ?? 0));

        upsertAdsetMetric($config, $accountId, [
            'campaign_id' => $campaignId,
            'adset_id' => $adsetId,
            'adset_name' => $adsetName,
            'metric_date' => $metricDate !== '' ? $metricDate : $yesterdayDate,
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

        $metricDate = trim((string) ($row['segments']['date'] ?? $yesterdayDate));
        $spend = googleAdsMicrosToCurrency($metrics['costMicros'] ?? 0);
        $impressions = parseMetricValue($metrics['impressions'] ?? 0);
        $clicks = parseMetricValue($metrics['clicks'] ?? 0);
        $conversions = (int) round((float) ($metrics['conversions'] ?? 0));

        upsertAdMetric($config, $accountId, [
            'campaign_id' => $campaignId,
            'adset_id' => $adsetId,
            'ad_id' => $adId,
            'ad_name' => $adName,
            'metric_date' => $metricDate !== '' ? $metricDate : $yesterdayDate,
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

    logLine(
        'Done ' . $accountName
        . ' [google_ads]: campaign_rows=' . $syncedCampaignRows
        . ' adset_masters=' . $syncedAdsetMasters
        . ' ad_masters=' . $syncedAdMasters
        . ' adset_rows=' . $syncedAdsetRows
        . ' ad_rows=' . $syncedAdRows,
    );
}
