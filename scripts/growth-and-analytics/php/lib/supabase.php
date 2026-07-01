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
        'instagram_profiles?select=id,instagram_id,username,access_token',
    );

    return is_array($rows) ? $rows : [];
}

function upsertPastPost(array $config, string $profileId, array $post): void
{
    supabaseRequest(
        $config,
        'POST',
        'past_posts_metrics?on_conflict=account_id,post_id',
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
        'instagram_daily_followers?on_conflict=account_id,date',
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
        'instagram_profiles?id=eq.' . rawurlencode($profileId),
        [
            'username' => $username,
            'followers_count' => $followersCount,
            'access_token' => $accessToken,
        ],
        ['Prefer: return=minimal'],
    );
}
