<?php

declare(strict_types=1);

/**
 * Google Ads campaign-type matrix helpers (mirrors UI googleCampaignTypeMatrix.ts).
 * Universal Phase 1 fields for all types; type-specific GAQL extras by channel.
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
    return 'campaign.id, campaign.name, campaign.status, campaign.advertisingChannelType, '
        . 'segments.date, metrics.impressions, metrics.clicks, metrics.costMicros, '
        . 'metrics.conversions, metrics.conversionsValue, metrics.averageCpm';
}

/**
 * Extra campaign-level GAQL metrics for a Digi campaign type id.
 * Empty string = no type-specific campaign query (universal only).
 */
function googleAdsTypeExtraCampaignSelect(string $typeId): string
{
    return match ($typeId) {
        'search' => 'metrics.searchImpressionShare, metrics.searchBudgetLostImpressionShare, '
            . 'metrics.searchRankLostImpressionShare',
        'shopping' => 'metrics.searchImpressionShare',
        'display' => 'metrics.activeViewViewability, metrics.averageCpm',
        'demand_gen' => 'metrics.averageCpm',
        'video' => 'metrics.averageCpm, metrics.videoViews, metrics.averageCpv, '
            . 'metrics.videoQuartileP25Rate, metrics.videoQuartileP50Rate, '
            . 'metrics.videoQuartileP75Rate, metrics.videoQuartileP100Rate',
        default => '',
    };
}

/** @return list<string> Google advertisingChannelType enums for a Digi type id. */
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
    return ['search', 'shopping', 'display', 'demand_gen', 'video'];
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
