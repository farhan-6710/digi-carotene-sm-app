<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function supabaseRequest(
    array $config,
    string $method,
    string $path,
    ?array $body = null,
    array $extraHeaders = [],
): array {
    $url = rtrim($config['supabase_url'], '/') . '/rest/v1/' . ltrim($path, '/');
    $headers = array_merge([
        'apikey: ' . $config['supabase_service_key'],
        'Authorization: Bearer ' . $config['supabase_service_key'],
    ], $extraHeaders);

    return httpJson($method, $url, $body, $headers);
}

// ─── Growth: organic ─────────────────────────────────────────────────────────

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

// ─── Growth: ads ─────────────────────────────────────────────────────────────

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

// ─── Post digest ─────────────────────────────────────────────────────────────

/** @return list<array{id: string, member_name: string, email: string, team_role: string}> */
function fetchTeamMembers(array $config): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'team_members?select=id,member_name,email,team_role&order=member_name.asc',
    );

    return is_array($rows) ? $rows : [];
}

function createPostDigestNotification(
    array $config,
    string $memberId,
    string $title,
    string $message,
): void {
    supabaseRequest(
        $config,
        'POST',
        'notifications',
        [
            'recipient_team_member_id' => $memberId,
            'notification_type' => 'post_digest',
            'title' => $title,
            'message' => $message,
            'status' => 'unread',
            'related_id' => null,
        ],
        ['Prefer: return=minimal'],
    );
}

/** @return list<string> */
function fetchManagedProjectIds(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'sm_projects?select=id&manager_id=eq.' . rawurlencode($memberId),
    );

    return projectIdsFromRows(is_array($rows) ? $rows : []);
}

/** @return list<string> */
function fetchOnTeamProjectIds(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'project_team_members?select=project_id&member_id=eq.'
            . rawurlencode($memberId)
            . '&ended_at=is.null',
    );

    if (!is_array($rows)) {
        return [];
    }

    $ids = [];
    foreach ($rows as $row) {
        $id = is_string($row['project_id'] ?? null) ? $row['project_id'] : '';
        if ($id !== '') {
            $ids[] = $id;
        }
    }

    return array_values(array_unique($ids));
}

/**
 * Posts for a schedule day, optionally filtered by project ids and/or status.
 *
 * @param list<string>|null $projectIds null = all projects
 * @return list<array<string, mixed>>
 */
function fetchPostsForDigest(
    array $config,
    string $date,
    ?array $projectIds,
    ?string $status = null,
): array {
    if (is_array($projectIds) && $projectIds === []) {
        return [];
    }

    $query = 'posts?select=id,post_title,post_type,status,to_be_posted_date,to_be_posted_time,'
        . 'socials,projects:sm_projects(project_name,clients(client_name))'
        . '&to_be_posted_date=eq.' . rawurlencode($date)
        . '&order=to_be_posted_date.asc,to_be_posted_time.asc';

    if ($status !== null) {
        $query .= '&status=eq.' . rawurlencode($status);
    }

    if (is_array($projectIds)) {
        $query .= '&project_id=in.(' . implode(',', array_map('rawurlencode', $projectIds)) . ')';
    }

    $rows = supabaseRequest($config, 'GET', $query);

    return is_array($rows) ? $rows : [];
}

/** @param list<array{id?: mixed}> $rows @return list<string> */
function projectIdsFromRows(array $rows): array
{
    $ids = [];
    foreach ($rows as $row) {
        $id = is_string($row['id'] ?? null) ? $row['id'] : '';
        if ($id !== '') {
            $ids[] = $id;
        }
    }

    return array_values(array_unique($ids));
}
