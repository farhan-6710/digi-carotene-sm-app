<?php

declare(strict_types=1);

/**
 * Rolling organic Instagram sync — posts posted in last ORGANIC_ROLLING_DAYS,
 * follower gains for last ORGANIC_FOLLOWER_ROLLING_DAYS (Meta API cap).
 */

require_once __DIR__ . '/../../lib/supabase.php';
require_once __DIR__ . '/../../lib/meta.php';
require_once __DIR__ . '/../../lib/sync_windows.php';

/**
 * @param array<string, mixed> $config
 */
function runOrganicRollingSync(array $config): void
{
    $timezone = (string) ($config['timezone'] ?? 'UTC');
    $window = organicPostWindow($timezone, ORGANIC_ROLLING_DAYS);
    $from = $window['from'];
    $toExclusive = $window['toExclusive'];
    $yesterdayDate = $window['yesterdayDate'];
    $fromDate = $from->format('Y-m-d');
    $toDate = $yesterdayDate;

    $followerWindow = syncWindowDates($timezone, ORGANIC_FOLLOWER_ROLLING_DAYS);

    logLine(
        'Starting organic sync. window=' . $fromDate . '..' . $toDate
        . ' (' . ORGANIC_ROLLING_DAYS . 'd posts, includes yesterday=' . $yesterdayDate . ')'
        . '; follower_days=' . ORGANIC_FOLLOWER_ROLLING_DAYS,
    );

    $profiles = fetchInstagramProfiles($config);
    if ($profiles === []) {
        logLine('No growth_organic_profiles rows found.');
        return;
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
                if ($timestamp === '' || !isPostedBetween($timestamp, $from, $toExclusive)) {
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

            $followerDays = 0;
            $dayCursor = new DateTimeImmutable($followerWindow['fromDate'], $from->getTimezone());
            $lastDay = new DateTimeImmutable($followerWindow['toDate'], $from->getTimezone());
            while ($dayCursor <= $lastDay) {
                $dayDate = $dayCursor->format('Y-m-d');
                $sinceUnix = (string) $dayCursor->getTimestamp();
                $untilUnix = (string) $dayCursor->getTimestamp();
                $followersGained = fetchFollowerGainForDay(
                    $config,
                    $instagramId,
                    $accessToken,
                    $sinceUnix,
                    $untilUnix,
                );
                upsertDailyFollower($config, $profileId, $dayDate, $followersGained);
                $followerDays++;
                $dayCursor = $dayCursor->modify('+1 day');
            }

            updateInstagramProfile(
                $config,
                $profileId,
                $metaProfile['username'] !== '' ? $metaProfile['username'] : $username,
                $metaProfile['followers_count'],
                $accessToken,
            );

            logLine(
                'Done ' . $username . ': posts=' . $syncedPosts
                . ', follower_days=' . $followerDays,
            );
        } catch (Throwable $error) {
            logLine('Error for ' . $username . ': ' . $error->getMessage());
        }
    }

    logLine(
        'Organic sync complete. window=' . $fromDate . '..' . $toDate
        . ' (' . ORGANIC_ROLLING_DAYS . 'd posts, includes yesterday=' . $yesterdayDate . ')'
        . '; follower_days=' . ORGANIC_FOLLOWER_ROLLING_DAYS,
    );
}
