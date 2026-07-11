# Growth & Analytics

Instagram Phase 1 dashboard + Meta ads campaign analytics + midnight sync.

## Features

| Area | Status | Doc |
|------|--------|-----|
| Connect + 29-day post backfill | Live (browser) | This file |
| Dashboard metrics from `past_posts_metrics` | Live | This file |
| Followers Gained (29-day backfill + daily sync) | Live | This file |
| Ad account connect + campaign/adset/ad backfill | Live (browser) | This file |
| Campaign analytics drill-down (campaign → ad set → ad) | Live | This file |
| Detail-page date filters (URL-synced) | Live | This file |
| Live Meta breakdowns (age / gender / placement) | Live (browser) | This file |
| Midnight PHP cron (yesterday sync) | Live | [scripts/growth-and-analytics/php/README.md](../../scripts/growth-and-analytics/php/README.md) |

## Data model

### Organic (Instagram Phase 1)

| Table | Purpose |
|-------|---------|
| `instagram_profiles` | Meta token, username, current follower count |
| `past_posts_metrics` | Post-level reach, impressions, engagement (backfill + daily upsert) |
| `instagram_daily_followers` | Net followers gained per calendar day |

Migrations: `018` (profiles + posts), `021` (daily followers).

### Ads (campaign analytics)

| Table | Purpose |
|-------|---------|
| `growth_ad_accounts` | Connected Meta ad accounts (token, currency) |
| `growth_ad_campaign_daily_metrics` | Campaign daily spend, delivery, conversions |
| `growth_adsets` | Ad set master (targeting/placement summaries) |
| `growth_adset_daily_metrics` | Ad set daily metrics |
| `growth_ads` | Ad master (name, creative summary) |
| `growth_ad_daily_metrics` | Ad daily metrics |

Migrations: `022` (campaign metrics), `025` (adset/ad masters + daily metrics). See [database.md](../database.md).

**Breakdowns are not stored.** Age, gender, and placement pivots are fetched live from Meta Insights when the user selects a breakdown on a detail page. No extra migration or cron job.

## Connect flow

### Organic

1. User connects Instagram in **Manage Accounts**.
2. `runInstagram29DayBackfill` fetches media from Meta Graph **v24**.
3. Posts in the last **29 completed days** (excludes today) → `past_posts_metrics`.
4. `follower_count` insights for the same window → `instagram_daily_followers`.
5. Profile row updated with latest token, username, and follower count.

### Ads

1. User connects an ad account in **Manage Accounts** (paste Meta access token).
2. `runAdBackfill` pulls campaign / ad set / ad masters and daily metrics into Supabase.
3. PHP cron extends stored rows nightly (`sync_yesterday_ads_acc.php`).

## Dashboard (organic)

- **Posts Interactions / Posts Reach** — aggregated from `past_posts_metrics` in the selected date range.
- **Followers Gained** — sum of `instagram_daily_followers.followers_gained` in the selected range (populated on connect backfill, then extended nightly by PHP cron).

## Campaign analytics (ads)

Hierarchy: **Campaign Analytics** → campaign detail → ad set detail → ad detail.

- **Stored metrics** — daily rows from Supabase, filtered client-side by the page date range (URL-synced `DateFilters`; no refetch on filter change).
- **Breakdown dropdown** — on the main metrics table only:
  - **Campaign detail** — *Daily metrics* table
  - **Ad detail** — *Daily metrics* table
- **Ad set detail → Ads table** — ad listing with links into each ad; no breakdown (entity list, not a metrics pivot).
- **Breakdown options**
  - **Age** and **Gender** — can be combined (Ads Manager–style pivot: age group → All → Male / Female / Uncategorised).
  - **Placement** — exclusive; selecting it clears age/gender. Uses Meta `publisher_platform,platform_position`.
- **Placement API limits** — Meta rejects `results` / `actions` with placement breakdowns, so conversions show as zero for placement rows (same as Ads Manager “—”).
- **All time** — breakdown requests fall back to the default Meta sync window (~29 days) because Insights requires explicit dates.

## Daily sync (GoDaddy)

PHP **8.2.30** cron under `scripts/growth-and-analytics/php/`. See the [PHP README](../../scripts/growth-and-analytics/php/README.md) for setup.

## Code map

```
src/features/growth-and-analytics/   UI, hooks, utils
  hooks/useGrowthAdEntityBreakdown.ts   Live Meta breakdown fetch (campaign / adset / ad scope)
  components/tables/DailyMetricsBreakdownSelect.tsx
  utils/campaignDemographicBreakdown.ts
src/services/
  instagramBackfillService.ts      Connect backfill (organic)
  adBackfillService.ts             Connect backfill (ads)
  instagramDailyFollowersService.ts  Follower rows
  pastPostsMetricsService.ts         Post rows
  metaService.ts                     Meta Graph API (incl. fetchAdBreakdownInsights)
scripts/growth-and-analytics/php/    Midnight cron
```
