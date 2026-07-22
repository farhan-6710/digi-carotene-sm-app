<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function supabaseRequest(array $config, string $method, string $path, ?array $body = null, array $extraHeaders = []): array
{
    $url = rtrim($config['supabase_url'], '/') . '/rest/v1/' . ltrim($path, '/');
    $headers = array_merge([
        'apikey: ' . $config['supabase_service_key'],
        'Authorization: Bearer ' . $config['supabase_service_key'],
    ], $extraHeaders);

    return httpJson($method, $url, $body, $headers);
}

/** @return list<array{id: string, instagram_id: string, username: string, access_token: string}> */
function fetchInstagramProfiles(array $config): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'growth_organic_profiles?select=id,instagram_id,username,access_token',
    );

    return is_array($rows) ? $rows : [];
}

function upsertPastPost(array $config, string $profileId, array $post): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_organic_posts_metrics?on_conflict=account_id,post_id',
        [
            'account_id' => $profileId,
            'post_id' => $post['post_id'],
            'caption' => $post['caption'],
            'media_type' => $post['media_type'],
            'created_at' => $post['created_at'],
            'reach' => $post['reach'],
            'impressions' => $post['impressions'],
            'likes' => $post['likes'],
            'comments' => $post['comments'],
            'saves' => $post['saves'],
            'shares' => $post['shares'],
            'reposts' => $post['reposts'],
            'post_thumbnail' => $post['post_thumbnail'],
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}

function upsertDailyFollower(array $config, string $profileId, string $date, int $gained): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_organic_daily_followers?on_conflict=account_id,date',
        [
            'account_id' => $profileId,
            'date' => $date,
            'followers_gained' => $gained,
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}

function updateInstagramProfile(array $config, string $profileId, string $username, int $followersCount, string $accessToken): void
{
    supabaseRequest(
        $config,
        'PATCH',
        'growth_organic_profiles?id=eq.' . rawurlencode($profileId),
        [
            'username' => $username,
            'followers_count' => $followersCount,
            'access_token' => $accessToken,
        ],
        ['Prefer: return=minimal'],
    );
}

/** @return list<array{id: string, ad_account_id: string, account_name: string, access_token: string}> */
function fetchAdAccounts(array $config): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'growth_ads_accounts?select=id,ad_account_id,account_name,access_token',
    );

    return is_array($rows) ? $rows : [];
}

function upsertAdCampaignMetric(array $config, string $adAccountId, array $row): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_ads_campaign_daily_metrics?on_conflict=ad_account_id,campaign_id,metric_date',
        [
            'ad_account_id' => $adAccountId,
            'campaign_id' => $row['campaign_id'],
            'campaign_name' => $row['campaign_name'],
            'status' => $row['status'],
            'objective' => $row['objective'] ?? null,
            'metric_date' => $row['metric_date'],
            'spend' => $row['spend'],
            'impressions' => $row['impressions'],
            'reach' => $row['reach'],
            'clicks' => $row['clicks'],
            'cpm' => $row['cpm'],
            'frequency' => $row['frequency'],
            'conversions' => $row['conversions'],
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}

function upsertAdsetMaster(array $config, string $adAccountId, array $row): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_ads_adsets?on_conflict=ad_account_id,adset_id',
        [
            'ad_account_id' => $adAccountId,
            'campaign_id' => $row['campaign_id'],
            'adset_id' => $row['adset_id'],
            'adset_name' => $row['adset_name'],
            'performance_goal' => $row['performance_goal'] ?? null,
            'location_summary' => $row['location_summary'] ?? null,
            'age_summary' => $row['age_summary'] ?? null,
            'custom_targeting_summary' => $row['custom_targeting_summary'] ?? null,
            'detailed_targeting_summary' => $row['detailed_targeting_summary'] ?? null,
            'placements_summary' => $row['placements_summary'] ?? null,
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}

function upsertAdMaster(array $config, string $adAccountId, array $row): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_ads_ads?on_conflict=ad_account_id,ad_id',
        [
            'ad_account_id' => $adAccountId,
            'campaign_id' => $row['campaign_id'],
            'adset_id' => $row['adset_id'],
            'ad_id' => $row['ad_id'],
            'ad_name' => $row['ad_name'],
            'thumbnail_url' => $row['thumbnail_url'] ?? null,
            'primary_text' => $row['primary_text'] ?? null,
            'headline' => $row['headline'] ?? null,
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}

function upsertAdsetMetric(array $config, string $adAccountId, array $row): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_ads_adset_daily_metrics?on_conflict=ad_account_id,adset_id,metric_date',
        [
            'ad_account_id' => $adAccountId,
            'campaign_id' => $row['campaign_id'],
            'adset_id' => $row['adset_id'],
            'adset_name' => $row['adset_name'],
            'metric_date' => $row['metric_date'],
            'spend' => $row['spend'],
            'impressions' => $row['impressions'],
            'reach' => $row['reach'],
            'clicks' => $row['clicks'],
            'cpm' => $row['cpm'],
            'frequency' => $row['frequency'],
            'conversions' => $row['conversions'],
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}

function upsertAdMetric(array $config, string $adAccountId, array $row): void
{
    supabaseRequest(
        $config,
        'POST',
        'growth_ads_ad_daily_metrics?on_conflict=ad_account_id,ad_id,metric_date',
        [
            'ad_account_id' => $adAccountId,
            'campaign_id' => $row['campaign_id'],
            'adset_id' => $row['adset_id'],
            'ad_id' => $row['ad_id'],
            'ad_name' => $row['ad_name'],
            'metric_date' => $row['metric_date'],
            'spend' => $row['spend'],
            'impressions' => $row['impressions'],
            'reach' => $row['reach'],
            'clicks' => $row['clicks'],
            'cpm' => $row['cpm'],
            'frequency' => $row['frequency'],
            'conversions' => $row['conversions'],
        ],
        ['Prefer: resolution=merge-duplicates,return=minimal'],
    );
}
