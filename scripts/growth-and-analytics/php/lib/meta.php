<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function metaGraphGet(array $config, string $path, array $params): array
{
    $base = rtrim($config['meta_graph_base_url'], '/');
    $version = $config['meta_api_version'];
    $url = $base . '/' . $version . '/' . ltrim($path, '/');
    if ($params !== []) {
        $url .= '?' . http_build_query($params);
    }

    return httpJson('GET', $url, null);
}

/** @return list<array<string, mixed>> */
function metaGraphGetAll(array $config, string $path, array $params): array
{
    $items = [];
    $nextUrl = null;

    do {
        $page = $nextUrl
            ? httpJson('GET', $nextUrl, null)
            : metaGraphGet($config, $path, $params);

        $data = $page['data'] ?? [];
        if (is_array($data)) {
            foreach ($data as $row) {
                if (is_array($row)) {
                    $items[] = $row;
                }
            }
        }

        $next = $page['paging']['next'] ?? null;
        $nextUrl = is_string($next) && $next !== '' ? $next : null;
    } while ($nextUrl !== null);

    return $items;
}

function parseMetricValue(mixed $value): int
{
    if (is_int($value)) {
        return $value;
    }
    if (is_float($value)) {
        return (int) round($value);
    }
    if (is_array($value) && isset($value['value']) && is_numeric($value['value'])) {
        return (int) round((float) $value['value']);
    }

    return 0;
}

function mapMediaType(?string $mediaType, ?string $productType): string
{
    if ($productType === 'REELS' || $mediaType === 'REELS') {
        return 'REEL';
    }
    if ($mediaType === 'CAROUSEL_ALBUM') {
        return 'CAROUSEL';
    }
    if ($mediaType === 'VIDEO') {
        return 'VIDEO';
    }

    return 'IMAGE';
}

/** @param array<string, mixed> $item */
function resolvePostThumbnail(array $item, string $mediaType): ?string
{
    $mediaUrl = is_string($item['media_url'] ?? null) ? trim($item['media_url']) : '';
    $thumbUrl = is_string($item['thumbnail_url'] ?? null) ? trim($item['thumbnail_url']) : '';

    if ($mediaType === 'IMAGE' || $mediaType === 'CAROUSEL') {
        return $mediaUrl !== '' ? $mediaUrl : null;
    }
    if ($mediaType === 'REEL' || $mediaType === 'VIDEO') {
        if ($thumbUrl !== '') {
            return $thumbUrl;
        }
        return $mediaUrl !== '' ? $mediaUrl : null;
    }

    return null;
}

function fetchInstagramProfile(array $config, string $instagramId, string $accessToken): array
{
    $data = metaGraphGet($config, $instagramId, [
        'fields' => 'followers_count,username',
        'access_token' => $accessToken,
    ]);

    return [
        'username' => is_string($data['username'] ?? null) ? $data['username'] : '',
        'followers_count' => parseMetricValue($data['followers_count'] ?? 0),
    ];
}

/** @return list<array<string, mixed>> */
function fetchInstagramMedia(array $config, string $instagramId, string $accessToken): array
{
    return metaGraphGetAll($config, $instagramId . '/media', [
        'fields' => 'id,caption,media_type,media_product_type,timestamp,like_count,comments_count,media_url,thumbnail_url',
        'limit' => '100',
        'access_token' => $accessToken,
    ]);
}

function fetchPostInsights(array $config, string $mediaId, string $accessToken): array
{
    $fetchMetric = static function (string $metric) use ($config, $mediaId, $accessToken): int {
        try {
            $data = metaGraphGet($config, $mediaId . '/insights', [
                'metric' => $metric,
                'period' => 'lifetime',
                'access_token' => $accessToken,
            ]);
            $rows = $data['data'] ?? [];
            if (!is_array($rows)) {
                return 0;
            }
            foreach ($rows as $row) {
                if (!is_array($row) || ($row['name'] ?? '') !== $metric) {
                    continue;
                }
                $values = $row['values'] ?? [];
                if (!is_array($values) || !isset($values[0])) {
                    return 0;
                }
                $first = $values[0];
                return is_array($first) ? parseMetricValue($first['value'] ?? 0) : 0;
            }
        } catch (Throwable) {
            return 0;
        }

        return 0;
    };

    $reach = $fetchMetric('reach');
    $views = $fetchMetric('views');

    return [
        'reach' => $reach,
        'impressions' => $views,
        'saves' => $fetchMetric('saved'),
        'shares' => $fetchMetric('shares'),
        'reposts' => $fetchMetric('reposts'),
    ];
}

function fetchFollowerGainForDay(
    array $config,
    string $instagramId,
    string $accessToken,
    string $sinceUnix,
    string $untilUnix,
): int {
    try {
        $data = metaGraphGet($config, $instagramId . '/insights', [
            'period' => 'day',
            'since' => $sinceUnix,
            'until' => $untilUnix,
            'metric' => 'follower_count',
            'access_token' => $accessToken,
        ]);
    } catch (Throwable) {
        return 0;
    }

    $rows = $data['data'] ?? [];
    if (!is_array($rows)) {
        return 0;
    }

    foreach ($rows as $metric) {
        if (!is_array($metric) || ($metric['name'] ?? '') !== 'follower_count') {
            continue;
        }
        $values = $metric['values'] ?? [];
        if (!is_array($values)) {
            return 0;
        }
        $total = 0;
        foreach ($values as $point) {
            if (!is_array($point)) {
                continue;
            }
            $total += parseMetricValue($point['value'] ?? 0);
        }
        return $total;
    }

    return 0;
}

function isPostedBetween(string $timestamp, DateTimeImmutable $from, DateTimeImmutable $toExclusive): bool
{
    $posted = new DateTimeImmutable($timestamp);
    $posted = $posted->setTimezone($from->getTimezone());

    return $posted >= $from && $posted < $toExclusive;
}

function mapCampaignStatus(?string $status): string
{
    if ($status === 'ACTIVE') {
        return 'Active';
    }
    if ($status === 'PAUSED') {
        return 'Paused';
    }

    return 'Completed';
}

function parseSpend(mixed $value): float
{
    return round((float) ($value ?? 0), 2);
}

function parseConversions(mixed $actions): int
{
    if (!is_array($actions)) {
        return 0;
    }

    $types = [
        'lead',
        'onsite_conversion.lead_grouped',
        'purchase',
        'offsite_conversion.fb_pixel_purchase',
    ];
    $total = 0;

    foreach ($actions as $action) {
        if (!is_array($action)) {
            continue;
        }
        $type = is_string($action['action_type'] ?? null) ? $action['action_type'] : '';
        if (!in_array($type, $types, true)) {
            continue;
        }
        $total += (int) round((float) ($action['value'] ?? 0));
    }

    return $total;
}

/** @return list<array{id: string, name: string, status?: string}> */
function fetchAdCampaignStatuses(array $config, string $adAccountId, string $accessToken): array
{
    $id = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;

    return metaGraphGetAll($config, $id . '/campaigns', [
        'fields' => 'id,name,status',
        'limit' => '100',
        'access_token' => $accessToken,
    ]);
}

/** @return list<array<string, mixed>> */
function fetchAdDailyInsightsForDay(
    array $config,
    string $adAccountId,
    string $accessToken,
    string $date,
): array {
    $id = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;
    $timeRange = json_encode(['since' => $date, 'until' => $date], JSON_THROW_ON_ERROR);

    return metaGraphGetAll($config, $id . '/insights', [
        'fields' => 'campaign_id,campaign_name,spend,impressions,clicks,actions',
        'time_range' => $timeRange,
        'time_increment' => '1',
        'level' => 'campaign',
        'access_token' => $accessToken,
    ]);
}
