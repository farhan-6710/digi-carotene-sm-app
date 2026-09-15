<?php

declare(strict_types=1);

/**
 * Google Ads campaign-type matrix helpers (mirrors UI googleCampaignTypeMatrix.ts).
 * Universal Phase 1 fields for all types; type-specific GAQL extras by channel.
 * GAQL field names are snake_case (REST JSON responses may still be camelCase).
 */

/** @return 'search'|'performance_max'|'display'|'demand_gen'|'video'|'shopping'|'local_call'|'app'|'unknown' */
function googleAdsResolveCampaignType(?string $channelType): string
{
    $key = strtoupper(str_replace(' ', '_', trim((string) $channelType)));

    return match ($key) {
        'SEARCH' => 'search',
        'PERFORMANCE_MAX' => 'performance_max',
        'DISPLAY' => 'display',
        'DEMAND_GEN' => 'demand_gen',
        'VIDEO' => 'video',
        'SHOPPING' => 'shopping',
        'LOCAL', 'LOCAL_SERVICES', 'SMART' => 'local_call',
        'MULTI_CHANNEL' => 'app',
        default => 'unknown',
    };
}

/** GAQL SELECT metrics shared by every campaign type (Phase 1). */
function googleAdsUniversalCampaignSelect(): string
{
    return 'campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, '
        . 'segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, '
        . 'metrics.conversions, metrics.conversions_value, metrics.average_cpm';
}

/**
 * Extra campaign-level GAQL metrics for a Digi campaign type id.
 * Empty string = no type-specific campaign query (universal only).
 */
function googleAdsTypeExtraCampaignSelect(string $typeId): string
{
    return match ($typeId) {
        'search' => 'metrics.search_impression_share, metrics.search_budget_lost_impression_share, '
            . 'metrics.search_rank_lost_impression_share',
        'shopping' => 'metrics.search_impression_share',
        'display' => 'metrics.active_view_viewability, metrics.average_cpm',
        'demand_gen' => 'metrics.average_cpm',
        'video' => 'metrics.average_cpm, metrics.video_views, metrics.average_cpv, '
            . 'metrics.video_quartile_p25_rate, metrics.video_quartile_p50_rate, '
            . 'metrics.video_quartile_p75_rate, metrics.video_quartile_p100_rate',
        // Modern Smart/Local UI uses location_asset_*; older feed-item metrics still used on some accounts.
        'local_call' => 'metrics.all_conversions_from_location_asset_store_visits, '
            . 'metrics.all_conversions_from_location_asset_website, '
            . 'metrics.all_conversions_from_location_asset_directions, '
            . 'metrics.all_conversions_from_location_asset_click_to_call, '
            . 'metrics.all_conversions_from_location_asset_order, '
            . 'metrics.all_conversions_from_location_asset_menu, '
            . 'metrics.all_conversions_from_location_asset_other_engagement, '
            . 'metrics.all_conversions_from_store_visit, '
            . 'metrics.all_conversions_from_store_website, '
            . 'metrics.all_conversions_from_directions, '
            . 'metrics.all_conversions_from_click_to_call, '
            . 'metrics.all_conversions_from_order, '
            . 'metrics.all_conversions_from_menu, '
            . 'metrics.all_conversions_from_other_engagement',
        default => '',
    };
}

/**
 * Sum related local-action metric keys (camelCase + snake_case pairs).
 *
 * @param list<string> $keys
 */
function googleAdsLocalActionCount(array $metrics, string ...$keys): float
{
    $total = 0.0;
    $i = 0;
    $n = count($keys);
    while ($i < $n) {
        $camel = $keys[$i];
        $snake = $keys[$i + 1] ?? $camel;
        $total += googleAdsCountMetric($metrics, $camel, $snake);
        $i += 2;
    }

    return round($total, 4);
}

/** @return list<string> Google advertising_channel_type enums for a Digi type id. */
function googleAdsChannelTypesForDigiType(string $typeId): array
{
    return match ($typeId) {
        'search' => ['SEARCH'],
        'performance_max' => ['PERFORMANCE_MAX'],
        'display' => ['DISPLAY'],
        'demand_gen' => ['DEMAND_GEN'],
        'video' => ['VIDEO'],
        'shopping' => ['SHOPPING'],
        'local_call' => ['LOCAL', 'LOCAL_SERVICES', 'SMART'],
        'app' => ['MULTI_CHANNEL'],
        default => [],
    };
}

/**
 * Types that need a follow-up campaign metrics query beyond universal.
 *
 * @return list<string>
 */
function googleAdsTypesWithCampaignExtras(): array
{
    return ['search', 'shopping', 'display', 'demand_gen', 'video', 'local_call'];
}

function googleAdsCountMetric(array $metrics, string ...$keys): float
{
    $raw = googleAdsMetricGet($metrics, ...$keys);
    if ($raw === null || $raw === '') {
        return 0.0;
    }

    return round((float) $raw, 4);
}

function googleAdsMetricGet(array $metrics, string ...$keys): mixed
{
    foreach ($keys as $key) {
        if (array_key_exists($key, $metrics) && $metrics[$key] !== null) {
            return $metrics[$key];
        }
    }

    return null;
}

function googleAdsShareToFloat(mixed $raw): ?float
{
    if ($raw === null || $raw === '') {
        return null;
    }
    $value = (float) $raw;
    // Google often returns 0.0–1.0 fractions; keep as fraction for DB.
    if ($value < 0) {
        return null;
    }

    return round($value, 6);
}
