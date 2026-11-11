# Growth on-demand refetch (working plan)

**Delete this file after the refactor ships.** Permanent docs stay in `meta-integration-growth-and-analytics.md`, `database.md`, `scripts/php/README.md`.

## Goal

Replace Growth midnight PHP crons with:

1. **Connect** → backfill live Meta/Google data into Supabase (already exists).
2. **Screens** → show how stale the account data is.
3. **Refetch this account** → user pulls ~**90 days** again; modal with progress + Cancel only.

Digest crons (`send_midnight_*`) stay. Growth sync crons go away.

---

## Keep DB — do not wipe

Existing Growth tables are already flat V1. **Do not drop/recreate.** Reconnect only if tokens are broken.

| Group    | Tables                                                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organic  | `growth_organic_accounts`, `growth_organic_profiles`, `growth_organic_posts_metrics`, `growth_organic_daily_followers`                                                      |
| Ads      | `growth_ad_accounts`, `growth_ad_campaign_daily_metrics`, `growth_ad_adsets`, `growth_ad_adset_daily_metrics`, `growth_ad_ad`, `growth_ad_daily_metrics` (+ Google helpers) |
| Learning | `campaign_*`, `growth_job_runs` (optional; not required for refetch)                                                                                                        |

**Schema tweak:** add `last_synced_at` on `growth_organic_accounts` (ads already has it). Stamp **only after a full successful refetch**. If any step fails or user cancels mid-way → do **not** stamp; banner stays honest (“some parts still stale”).

---

## Windows (one number)

| Data                              | Window                | Note                                           |
| --------------------------------- | --------------------- | ---------------------------------------------- |
| Ads daily insights                | **90** completed days | Already `AD_BACKFILL_DAYS = 90`                |
| Organic posts (lifetime insights) | **90** completed days | Change from 29 → 90                            |
| Organic follower_count            | **30** days           | Meta API cap — keep; label honestly in UI copy |
| Insights chunk size               | **28** days           | Meta rejects wider `since`/`until`             |

Constants: `src/features/growth-and-analytics/constants/metaConfig.ts`.

---

## Existing code to reuse (do not reinvent)

| Job                        | Where                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Meta Graph fetch           | `src/services/metaService.ts` (`graphGet` / `graphGetAll`)                                                      |
| Ads connect + 90d backfill | `src/services/adBackfillService.ts` → `runAdBackfill` / `rerunAdBackfillForAccount`                             |
| IG connect + backfill      | `src/services/instagramBackfillService.ts` → `runInstagramBackfill` / `rerunInstagramBackfillForOrganicAccount` |
| Connect orchestration      | `src/services/growthAccountsService.ts`                                                                         |
| Google connect/refetch backfill | `src/services/googleAdBackfillService.ts` (browser TypeScript)                                            |
| Stale helpers              | `utils/isSyncStale.ts`, `LearningStaleDataBanner`                                                               |
| Dialog primitive           | `shared/ui/dialog.tsx` (`showCloseButton={false}`)                                                              |
| Toasts                     | `showToast`                                                                                                     |

PHP Growth sync **deleted** (Meta + Google). Refresh is browser TypeScript only. PHP remains for Resend emails (digests + custom report).

---

## Meta API cheat sheet

Base: `https://graph.facebook.com/{version}/{path}?…&access_token=…`

Versions (current): IG dashboard `v19.0`, IG backfill `v24.0`, FB/ads `v18.0`.

### Connect / validate

| Call                | Path                | Key params                                                 | Response used           |
| ------------------- | ------------------- | ---------------------------------------------------------- | ----------------------- |
| IG info             | `GET /{ig-user-id}` | `fields=username,name,followers_count,profile_picture_url` | name, followers, pic    |
| FB Page info        | `GET /{page-id}`    | `fields=name,fan_count,followers_count`                    | name, fans              |
| Page token exchange | `GET /{page-id}`    | `fields=access_token`                                      | Page token for insights |
| Ad account info     | `GET /act_{id}`     | `fields=name,currency,account_status`                      | name, currency          |

### Organic Instagram refetch (browser)

| Step              | Path                       | Params                                                                                                                  | Response → DB                    |
| ----------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Profile           | `GET /{ig-id}`             | `fields=followers_count,username`                                                                                       | profile row                      |
| Media list        | `GET /{ig-id}/media`       | `fields=id,caption,media_type,media_product_type,timestamp,like_count,comments_count,media_url,thumbnail_url`, paginate | filter posts in 90d window       |
| Per-post insights | `GET /{media-id}/insights` | `metric=reach` then `views`, `saved`, `shares`, `reposts`, `period=lifetime` (one metric/request)                       | `growth_organic_posts_metrics`   |
| Followers/day     | `GET /{ig-id}/insights`    | `metric=follower_count`, `period=day`, `since`/`until` (≤30d)                                                           | `growth_organic_daily_followers` |

Progress units: posts processed / total posts (+ follower step at end).

### Ads Meta refetch (browser)

| Step                   | Path                      | Params                                                                                                                | Response → DB                             |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Campaigns              | `GET /act_{id}/campaigns` | `fields=id,name,status,objective`                                                                                     | status/objective maps                     |
| Ad sets                | `GET /act_{id}/adsets`    | targeting fields                                                                                                      | `growth_ad_adsets`                        |
| Ads                    | `GET /act_{id}/ads`       | creative fields                                                                                                       | `growth_ad_ad`                            |
| Daily insights × level | `GET /act_{id}/insights`  | `level=campaign\|adset\|ad`, `time_range={since,until}`, `time_increment=1`, metric fields, **chunked ≤28d** over 90d | campaign / adset / ad daily metric tables |

Progress units: insight chunks completed / total chunks (masters = early %).

### Live screens (unchanged)

Dashboard / content still read **Supabase cache** after refetch. Live Meta calls on Facebook organic analytics stay as today where already coded.

---

## UX — Refetch modal

- Trigger: **Refetch data** on Dashboard, Content Performance, Campaign Analytics (selected account).
- While running: page content in loading/disabled feel; **center modal**.
- Modal: **no X**, **no overlay dismiss**, **no Escape close**, **body scroll locked**.
- Only action: **Cancel refetch**.
- Body: short human copy (e.g. “Pulling the last 90 days from Meta and updating this account…”) + spinner + **Progress** bar + **%**.
- Cancel → abort in-flight loop; close modal; keep previous `last_synced_at`; toast info optional.
- Hard fail → close modal → `showToast("error", …)`; do not stamp sync.
- Success → stamp `last_synced_at` → close → toast success → refetch screen queries.

Copy stays non-dev. Follower Meta cap can be one soft line: “Follower history covers about the last 30 days (Meta limit).”

### Stale banner

- Fresh: “Last synced …”
- Stale / never / partial fail: “Some data is still stale from {label}. Numbers below may be out of date — refetch to refresh.”
- Prefer **Refetch** CTA over only Manage Accounts (keep Manage Accounts link for token issues).

---

## Architecture rules (V1)

- Same pattern for organic and ads: `run*Backfill(account, token, { onProgress, signal })`.
- One function = one job. Prefer repeated simple loops over shared mega-orchestrators.
- All Meta HTTP stays in `metaService` / existing backfill services. Pages call a thin hook only.
- No nested “sync framework”. No new caching layer.
- Add shadcn `Progress` under `shared/ui/progress.tsx` if missing.

---

## Phases

### Phase 0 — Align + schema + stop cron reliance

- [x] Set organic post window to **90** days (`INSTAGRAM_BACKFILL_DAYS`).
- [x] Migration: `093_organic_accounts_last_synced_at.sql`.
- [x] Stamp organic `last_synced_at` on successful backfill.
- [x] Docs: midnight Growth sync → on-demand; Hostinger Growth cron removed from schedule docs.
- [x] Deleted PHP Meta/organic rolling sync scripts + unused Meta PHP helpers.

### Phase 1 — Backfill progress + cancel

- [x] `onProgress({ completed, total, label })` on ads + IG backfill loops.
- [x] Accept `AbortSignal`; throw/stop cleanly on cancel.
- [x] Do **not** call `touch*LastSynced` unless every step succeeds.
- [x] Failures before stamp → toast + no stamp (cancel = info toast).

### Phase 2 — Modal + banner + button

- [x] Add `Progress` UI (`shared/ui/progress.tsx`).
- [x] `GrowthRefetchModal`: copy, loader, progress %, Cancel only.
- [x] `GrowthStaleDataBanner` + Learning wrapper.
- [x] Wire Refetch on Dashboard / Content / Campaign Analytics / campaign detail + Learning.

### Phase 3 — Hook + polish + docs

- [x] `useAccountRefetch`: modal, backfill, cancel, toast, page reload on success.
- [x] Google Ads Refetch → browser TypeScript `runGoogleAdBackfill` (progress + cancel).
- [x] Permanent docs updated; keep **this** file until manual Hostinger unschedule + QA.
- [x] Code/docs cleaned; ops: delete scheduled Hostinger jobs for removed `sync_last_*` if still present.

---

## Non-goals

- Selling / multi-tenant product polish.
- Rewriting Learning Tab.
- Live Meta on every chart render.
- Google asset-group / call-view extras in first TS backfill (campaign/adset/ad daily is enough for V1).
- Dropping digest crons.

---

## Task checklist

- [x] Phase 0
- [x] Phase 1
- [x] Phase 2
- [x] Phase 3 (code + docs)
- [ ] Manual test: connect IG + Meta ads → see data → wait/stale → Refetch → progress → success stamp
- [ ] Manual test: Cancel mid-refetch → stamp unchanged
- [ ] Manual test: bad token → error toast, modal closes
- [ ] Hostinger: remove any leftover Growth sync cron jobs + delete old PHP files on server if still uploaded
- [ ] Run migration `093` in Supabase
- [ ] Delete this MD after QA
