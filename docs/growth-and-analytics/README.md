# Growth & Analytics

Instagram Phase 1 dashboard + Phase 2 midnight sync.

## Features

| Area | Status | Doc |
|------|--------|-----|
| Connect + 29-day post backfill | Live (browser) | This file |
| Dashboard metrics from `past_posts_metrics` | Live | This file |
| Followers Gained (29-day backfill + daily sync) | Live | This file |
| Midnight PHP cron (yesterday sync) | Live | [scripts/growth-and-analytics/php/README.md](../../scripts/growth-and-analytics/php/README.md) |

## Data model

| Table | Purpose |
|-------|---------|
| `instagram_profiles` | Meta token, username, current follower count |
| `past_posts_metrics` | Post-level reach, impressions, engagement (backfill + daily upsert) |
| `instagram_daily_followers` | Net followers gained per calendar day |

Migrations: `018` (profiles + posts), `021` (daily followers). See [database.md](./database.md).

## Connect flow

1. User connects Instagram in **Manage Accounts**.
2. `runInstagram29DayBackfill` fetches media from Meta Graph **v24**.
3. Posts in the last **29 completed days** (excludes today) → `past_posts_metrics`.
4. `follower_count` insights for the same window → `instagram_daily_followers`.
5. Profile row updated with latest token, username, and follower count.

## Dashboard

- **Posts Interactions / Posts Reach** — aggregated from `past_posts_metrics` in the selected date range.
- **Followers Gained** — sum of `instagram_daily_followers.followers_gained` in the selected range (populated on connect backfill, then extended nightly by PHP cron).

## Daily sync (GoDaddy)

PHP **8.2.30** cron under `scripts/growth-and-analytics/php/`. See the [PHP README](../../scripts/growth-and-analytics/php/README.md) for setup.

## Code map

```
src/features/growth-and-analytics/   UI, hooks, utils
src/services/
  instagramBackfillService.ts      Connect backfill
  instagramDailyFollowersService.ts  Follower rows
  pastPostsMetricsService.ts         Post rows
  metaService.ts                     Meta Graph API
scripts/growth-and-analytics/php/    Midnight cron
```
