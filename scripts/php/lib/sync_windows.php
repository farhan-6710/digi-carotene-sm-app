<?php

declare(strict_types=1);

/**
 * Rolling midnight sync windows (inclusive through yesterday).
 * Meta follower_count insights only cover ~last 30 days — do not invent days.
 */

const ORGANIC_ROLLING_DAYS = 60;
const ADS_ROLLING_DAYS = 7;
/** Meta API cap for follower_count day insights (excludes today). */
const ORGANIC_FOLLOWER_ROLLING_DAYS = 30;

/**
 * @return array{fromDate: string, toDate: string, yesterdayDate: string}
 */
function syncWindowDates(string $timezone, int $days): array
{
    $tz = new DateTimeZone($timezone !== '' ? $timezone : 'UTC');
    $yesterday = new DateTimeImmutable('yesterday', $tz);
    $toDate = $yesterday->format('Y-m-d');
    $fromDate = $yesterday->modify('-' . max(1, $days - 1) . ' days')->format('Y-m-d');

    return [
        'fromDate' => $fromDate,
        'toDate' => $toDate,
        'yesterdayDate' => $toDate,
    ];
}

/**
 * Post media window: [today - $days, today) in account timezone.
 *
 * @return array{from: DateTimeImmutable, toExclusive: DateTimeImmutable, yesterdayDate: string}
 */
function organicPostWindow(string $timezone, int $days = ORGANIC_ROLLING_DAYS): array
{
    $tz = new DateTimeZone($timezone !== '' ? $timezone : 'UTC');
    $todayStart = new DateTimeImmutable('today', $tz);
    $from = $todayStart->modify('-' . max(1, $days) . ' days');
    $yesterday = $todayStart->modify('-1 day');

    return [
        'from' => $from,
        'toExclusive' => $todayStart,
        'yesterdayDate' => $yesterday->format('Y-m-d'),
    ];
}
