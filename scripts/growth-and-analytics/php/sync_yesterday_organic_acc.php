<?php

declare(strict_types=1);

/**
 * Midnight Instagram organic account sync — yesterday's posts + follower gain.
 * Run daily at 12:01 AM (server timezone in config.php).
 *
 * CLI:  php sync_yesterday_organic_acc.php
 * HTTP: https://your-domain.com/.../sync_yesterday_organic_acc.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/supabase.php';
require_once __DIR__ . '/lib/meta.php';

try {
    $config = loadConfig();
    assertCronAccess($config);

    $tz = new DateTimeZone($config['timezone'] ?? 'UTC');
    $todayStart = new DateTimeImmutable('today', $tz);
    $yesterdayStart = $todayStart->modify('-1 day');
    $yesterdayDate = $yesterdayStart->format('Y-m-d');
    $sinceUnix = (string) $yesterdayStart->getTimestamp();
    $untilUnix = (string) $yesterdayStart->getTimestamp();

    logLine('Starting sync for ' . $yesterdayDate);

    $profiles = fetchInstagramProfiles($config);
    if ($profiles === []) {
        logLine('No growth_organic_profiles rows found.');
        exit(0);
    }

    foreach ($profiles as $profile) {
        $profileId = (string) ($profile['id'] ?? '');
        $instagramId = (string) ($profile['instagram_id'] ?? '');
        $accessToken = (string) ($profile['access_token'] ?? '');
        $username = (string) ($profile['username'] ?? '');

        if ($profileId === '' || $instagramId === '' || $accessToken === '') {
            logLine('Skipping profile with missing credentials: ' . $username);
            continue;
        }

        logLine('Syncing ' . $username);

        try {
            $metaProfile = fetchInstagramProfile($config, $instagramId, $accessToken);
            $media = fetchInstagramMedia($config, $instagramId, $accessToken);
            $syncedPosts = 0;

            foreach ($media as $item) {
                $timestamp = is_string($item['timestamp'] ?? null) ? $item['timestamp'] : '';
                if ($timestamp === '' || !isPostedBetween($timestamp, $yesterdayStart, $todayStart)) {
                    continue;
                }

                $mediaType = mapMediaType(
                    is_string($item['media_type'] ?? null) ? $item['media_type'] : null,
                    is_string($item['media_product_type'] ?? null) ? $item['media_product_type'] : null,
                );
                $mediaId = is_string($item['id'] ?? null) ? $item['id'] : '';
                if ($mediaId === '') {
                    continue;
                }

                $insights = fetchPostInsights($config, $mediaId, $accessToken);
                $caption = is_string($item['caption'] ?? null) ? trim($item['caption']) : '';
                if ($caption === '') {
                    $caption = '(No caption)';
                }

                upsertPastPost($config, $profileId, [
                    'post_id' => $mediaId,
                    'caption' => $caption,
                    'media_type' => $mediaType,
                    'created_at' => $timestamp,
                    'reach' => $insights['reach'],
                    'impressions' => $insights['impressions'],
                    'likes' => parseMetricValue($item['like_count'] ?? 0),
                    'comments' => parseMetricValue($item['comments_count'] ?? 0),
                    'saves' => $insights['saves'],
                    'shares' => $insights['shares'],
                    'reposts' => $insights['reposts'],
                    'post_thumbnail' => resolvePostThumbnail($item, $mediaType),
                ]);
                $syncedPosts++;
            }

            $followersGained = fetchFollowerGainForDay(
                $config,
                $instagramId,
                $accessToken,
                $sinceUnix,
                $untilUnix,
            );
            upsertDailyFollower($config, $profileId, $yesterdayDate, $followersGained);

            updateInstagramProfile(
                $config,
                $profileId,
                $metaProfile['username'] !== '' ? $metaProfile['username'] : $username,
                $metaProfile['followers_count'],
                $accessToken,
            );

            logLine(
                'Done ' . $username . ': posts=' . $syncedPosts . ', followers_gained=' . $followersGained,
            );
        } catch (Throwable $error) {
            logLine('Error for ' . $username . ': ' . $error->getMessage());
        }
    }

    logLine('Sync complete.');
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
