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

function parseInsightStatList(mixed $entries): int
{
    if (!is_array($entries)) {
        return 0;
    }

    $total = 0;
    foreach ($entries as $entry) {
        if (!is_array($entry)) {
            continue;
        }
        if (isset($entry['value']) && $entry['value'] !== '') {
            $total += (int) round((float) $entry['value']);
            continue;
        }
        $nested = $entry['values'][0]['value'] ?? null;
        if ($nested !== null && $nested !== '') {
            $total += (int) round((float) $nested);
        }
    }

    return $total;
}

function parseConversions(mixed $actions): int
{
    if (!is_array($actions)) {
        return 0;
    }

    $byType = [];
    foreach ($actions as $action) {
        if (!is_array($action)) {
            continue;
        }
        $type = is_string($action['action_type'] ?? null) ? $action['action_type'] : '';
        if ($type === '') {
            continue;
        }
        $byType[$type] = (int) round((float) ($action['value'] ?? 0));
    }

    $groups = [
        ['onsite_conversion.lead_grouped', 'lead'],
        ['offsite_conversion.fb_pixel_purchase', 'purchase'],
        ['offsite_conversion.fb_pixel_lead', 'offsite_conversion.lead'],
        [
            'onsite_conversion.messaging_conversation_started_7d',
            'messaging_conversation_started_7d',
            'onsite_conversion.messaging_conversation_started_1d',
        ],
        [
            'onsite_conversion.messaging_first_reply',
            'onsite_conversion.total_messaging_connection',
        ],
    ];
    $total = 0;

    foreach ($groups as $group) {
        foreach ($group as $type) {
            if (!empty($byType[$type])) {
                $total += $byType[$type];
                break;
            }
        }
    }

    return $total;
}

function parseInsightConversions(array $insight): int
{
    $fromResults = parseInsightStatList($insight['results'] ?? null);
    if ($fromResults > 0) {
        return $fromResults;
    }

    return parseConversions($insight['actions'] ?? null);
}

function parseDecimal(mixed $value): float
{
    return round((float) ($value ?? 0), 2);
}

/** @return list<array{id: string, name: string, status?: string}> */
function fetchAdCampaignStatuses(array $config, string $adAccountId, string $accessToken): array
{
    $id = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;

    return metaGraphGetAll($config, $id . '/campaigns', [
        'fields' => 'id,name,status,objective',
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
    string $level = 'campaign',
): array {
    $id = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;
    $timeRange = json_encode(['since' => $date, 'until' => $date], JSON_THROW_ON_ERROR);

    $fieldsByLevel = [
        'campaign' => 'campaign_id,campaign_name,spend,impressions,reach,clicks,cpm,frequency,results,actions',
        'adset' => 'adset_id,adset_name,campaign_id,spend,impressions,reach,clicks,cpm,frequency,results,actions',
        'ad' => 'ad_id,ad_name,adset_id,campaign_id,spend,impressions,reach,clicks,cpm,frequency,results,actions',
    ];
    $fields = $fieldsByLevel[$level] ?? $fieldsByLevel['campaign'];

    return metaGraphGetAll($config, $id . '/insights', [
        'fields' => $fields,
        'time_range' => $timeRange,
        'time_increment' => '1',
        'level' => $level,
        'access_token' => $accessToken,
    ]);
}

/** @return list<array<string, mixed>> */
function fetchAdsetMasters(array $config, string $adAccountId, string $accessToken): array
{
    $id = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;

    return metaGraphGetAll($config, $id . '/adsets', [
        'fields' => 'id,name,campaign_id,optimization_goal,targeting,publisher_platforms,facebook_positions,instagram_positions',
        'limit' => '100',
        'access_token' => $accessToken,
    ]);
}

/** @return list<array<string, mixed>> */
function fetchAdMasters(array $config, string $adAccountId, string $accessToken): array
{
    $id = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;

    return metaGraphGetAll($config, $id . '/ads', [
        'fields' => 'id,name,adset_id,campaign_id,creative{thumbnail_url,body,title}',
        'limit' => '100',
        'access_token' => $accessToken,
    ]);
}

function titleCaseLabel(string $value): string
{
    $value = str_replace('_', ' ', $value);

    return ucwords($value);
}

function formatPerformanceGoal(?string $goal): ?string
{
    if (!is_string($goal) || trim($goal) === '') {
        return null;
    }

    return titleCaseLabel(trim($goal));
}

/** @param list<array{name?: string}>|null $items */
function joinTargetingNames(?array $items, int $limit = 5): ?string
{
    if ($items === null || $items === []) {
        return null;
    }

    $names = [];
    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        $name = is_string($item['name'] ?? null) ? trim($item['name']) : '';
        if ($name !== '') {
            $names[] = $name;
        }
    }

    if ($names === []) {
        return null;
    }

    $shown = array_slice($names, 0, $limit);
    $suffix = count($names) > $limit ? ' +' . (count($names) - $limit) . ' more' : '';

    return implode(', ', $shown) . $suffix;
}

/** @param array<string, mixed> $targeting */
function parseLocationSummary(array $targeting): ?string
{
    $geo = $targeting['geo_locations'] ?? null;
    if (!is_array($geo)) {
        return null;
    }

    $parts = [];
    $countries = $geo['countries'] ?? null;
    if (is_array($countries) && $countries !== []) {
        $parts[] = implode(', ', array_map('strval', $countries));
    }

    $cities = joinTargetingNames(is_array($geo['cities'] ?? null) ? $geo['cities'] : null);
    if (is_string($cities) && $cities !== '') {
        $parts[] = $cities;
    }

    $regions = joinTargetingNames(is_array($geo['regions'] ?? null) ? $geo['regions'] : null);
    if (is_string($regions) && $regions !== '') {
        $parts[] = $regions;
    }

    return $parts === [] ? null : implode(' · ', $parts);
}

/** @param array<string, mixed> $targeting */
function parseAgeSummary(array $targeting): ?string
{
    $min = $targeting['age_min'] ?? null;
    $max = $targeting['age_max'] ?? null;
    $hasMin = is_numeric($min);
    $hasMax = is_numeric($max);

    if ($hasMin && $hasMax) {
        return ((int) $min) . '–' . ((int) $max);
    }
    if ($hasMin) {
        return ((int) $min) . '+';
    }
    if ($hasMax) {
        return 'Up to ' . ((int) $max);
    }

    return null;
}

/** @param array<string, mixed> $targeting */
function parseCustomTargetingSummary(array $targeting): ?string
{
  $audiences = $targeting['custom_audiences'] ?? null;

  return joinTargetingNames(is_array($audiences) ? $audiences : null, 8);
}

/** @param array<string, mixed> $targeting */
function parseDetailedTargetingSummary(array $targeting): ?string
{
    $specs = $targeting['flexible_spec'] ?? null;
    if (!is_array($specs)) {
        return null;
    }

    $names = [];
    foreach ($specs as $spec) {
        if (!is_array($spec)) {
            continue;
        }
        foreach ($spec as $entries) {
            if (!is_array($entries)) {
                continue;
            }
            foreach ($entries as $entry) {
                if (!is_array($entry)) {
                    continue;
                }
                $name = is_string($entry['name'] ?? null) ? trim($entry['name']) : '';
                if ($name !== '') {
                    $names[] = $name;
                }
            }
        }
    }

    if ($names === []) {
        return null;
    }

    $unique = array_values(array_unique($names));
    $shown = array_slice($unique, 0, 8);
    $suffix = count($unique) > 8 ? ' +' . (count($unique) - 8) . ' more' : '';

    return implode(', ', $shown) . $suffix;
}

/** @param array<string, mixed> $adset */
function parsePlacementsSummary(array $adset): ?string
{
    $parts = [];

    $platforms = $adset['publisher_platforms'] ?? null;
    if (is_array($platforms) && $platforms !== []) {
        $parts[] = implode(', ', array_map('titleCaseLabel', array_map('strval', $platforms)));
    }

    $facebook = $adset['facebook_positions'] ?? null;
    if (is_array($facebook) && $facebook !== []) {
        $parts[] = 'Facebook: ' . implode(', ', array_map('titleCaseLabel', array_map('strval', $facebook)));
    }

    $instagram = $adset['instagram_positions'] ?? null;
    if (is_array($instagram) && $instagram !== []) {
        $parts[] = 'Instagram: ' . implode(', ', array_map('titleCaseLabel', array_map('strval', $instagram)));
    }

    return $parts === [] ? null : implode(' · ', $parts);
}

/** @param array<string, mixed> $adset */
function mapMetaAdsetRow(array $adset): ?array
{
    $adsetId = is_string($adset['id'] ?? null) ? trim($adset['id']) : '';
    $campaignId = is_string($adset['campaign_id'] ?? null) ? trim($adset['campaign_id']) : '';
    if ($adsetId === '' || $campaignId === '') {
        return null;
    }

    $targeting = is_array($adset['targeting'] ?? null) ? $adset['targeting'] : [];

    return [
        'campaign_id' => $campaignId,
        'adset_id' => $adsetId,
        'adset_name' => is_string($adset['name'] ?? null) && trim($adset['name']) !== ''
            ? trim($adset['name'])
            : 'Unnamed ad set',
        'performance_goal' => formatPerformanceGoal(
            is_string($adset['optimization_goal'] ?? null) ? $adset['optimization_goal'] : null,
        ),
        'location_summary' => parseLocationSummary($targeting),
        'age_summary' => parseAgeSummary($targeting),
        'custom_targeting_summary' => parseCustomTargetingSummary($targeting),
        'detailed_targeting_summary' => parseDetailedTargetingSummary($targeting),
        'placements_summary' => parsePlacementsSummary($adset),
    ];
}

/** @param array<string, mixed> $ad */
function mapMetaAdRow(array $ad): ?array
{
    $adId = is_string($ad['id'] ?? null) ? trim($ad['id']) : '';
    $adsetId = is_string($ad['adset_id'] ?? null) ? trim($ad['adset_id']) : '';
    $campaignId = is_string($ad['campaign_id'] ?? null) ? trim($ad['campaign_id']) : '';
    if ($adId === '' || $adsetId === '' || $campaignId === '') {
        return null;
    }

    $creative = is_array($ad['creative'] ?? null) ? $ad['creative'] : [];

    return [
        'campaign_id' => $campaignId,
        'adset_id' => $adsetId,
        'ad_id' => $adId,
        'ad_name' => is_string($ad['name'] ?? null) && trim($ad['name']) !== ''
            ? trim($ad['name'])
            : 'Unnamed ad',
        'thumbnail_url' => is_string($creative['thumbnail_url'] ?? null) && trim($creative['thumbnail_url']) !== ''
            ? trim($creative['thumbnail_url'])
            : null,
        'primary_text' => is_string($creative['body'] ?? null) && trim($creative['body']) !== ''
            ? trim($creative['body'])
            : null,
        'headline' => is_string($creative['title'] ?? null) && trim($creative['title']) !== ''
            ? trim($creative['title'])
            : null,
    ];
}
