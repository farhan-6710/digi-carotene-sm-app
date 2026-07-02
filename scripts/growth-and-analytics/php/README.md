# Growth & Analytics — midnight sync (PHP)

Runs on **GoDaddy** (PHP 8.2.30). GoDaddy cron hits a URL; scripts sync **yesterday’s** data into Supabase.

| Script | What it syncs |
|--------|----------------|
| `sync_yesterday_organic_acc.php` | Instagram organic posts + follower gain |
| `sync_yesterday_ads_acc.php` | Meta ad campaign daily metrics |

## Quick setup (URL cron — easiest on GoDaddy)

### 1. Supabase

Run migrations in the SQL Editor (if not done already):

- [`021_instagram_daily_followers.sql`](../../migrations/021_instagram_daily_followers.sql)
- [`022_ad_campaign_metrics.sql`](../../migrations/022_ad_campaign_metrics.sql)

### 2. Edit `config.php`

Open `config.php` in this folder and set:

| Key | Where to get it |
|-----|-----------------|
| `supabase_service_key` | Supabase → **Project Settings → API → service_role** (secret key) |
| `cron_secret` | Any long random string you invent (e.g. run `openssl rand -hex 32` locally). One shared secret is fine for both cron URLs. |

`supabase_url` and `timezone` are already set. Do **not** commit `config.php` after adding the service role key.

### 3. Upload to GoDaddy

Upload the whole `php/` folder via **File Manager** or FTP, e.g.:

```text
public_html/growth-and-analytics/php/
  config.php
  sync_yesterday_organic_acc.php
  sync_yesterday_ads_acc.php
  lib/
  .htaccess
```

### 4. Test in the browser

Instagram sync:

```text
https://YOUR-DOMAIN.com/growth-and-analytics/php/sync_yesterday_organic_acc.php?secret=YOUR_CRON_SECRET
```

Ad campaign sync:

```text
https://YOUR-DOMAIN.com/growth-and-analytics/php/sync_yesterday_ads_acc.php?secret=YOUR_CRON_SECRET
```

You should see log lines like:

```text
[2026-07-01 00:15:00] Starting sync for 2026-06-30
[2026-07-01 00:15:01] Syncing your_username
[2026-07-01 00:15:05] Done your_username: posts=1, followers_gained=12
[2026-07-01 00:15:05] Sync complete.
```

Check Supabase:

- Instagram: `past_posts_metrics`, `instagram_daily_followers`
- Ads: `growth_ad_campaign_daily_metrics`

### 5. Add GoDaddy cron (cPanel)

Add **two** daily jobs at **12:05 AM** (or stagger by a few minutes):

```bash
curl -s "https://YOUR-DOMAIN.com/growth-and-analytics/php/sync_yesterday_organic_acc.php?secret=YOUR_CRON_SECRET"
curl -s "https://YOUR-DOMAIN.com/growth-and-analytics/php/sync_yesterday_ads_acc.php?secret=YOUR_CRON_SECRET"
```

**Timezone note:** cPanel cron time is usually **server time** (often US). If your server is not in India, adjust the hour so the job runs just after midnight **India time**. Example: if server is US Eastern, 12:05 AM IST is roughly 1:35 PM previous day Eastern — use cPanel’s time labels or test once and shift the hour.

---

## Is the service role key safe on the server?

**Yes, if you follow these rules:**

| Do | Don’t |
|----|--------|
| Keep `config.php` only on GoDaddy (server filesystem) | Put the service role key in the React app or `.env` committed to git |
| Use `.htaccess` (included) to block web access to `config.php` | Share the key in chat/email |
| Restrict who has FTP/cPanel access | Use the service role key in the browser |

The service role **bypasses RLS** — that’s why the cron can write to your tables. It never appears in the frontend; only the PHP sync entry files read it on the server.

The **cron secret** in the URL stops random visitors from triggering a sync. Use a long random value.

---

## Is URL cron reliable?

**Good enough for a daily Instagram sync** on GoDaddy shared hosting:

| Pros | Cons |
|------|------|
| No SSH or PHP path hunting | GoDaddy may skip a run during rare maintenance |
| Works on basic plans | HTTP request can **time out** if you sync many accounts (30–60s limit) |
| Easy to test in a browser | No automatic retry if curl fails silently |

**For 1–5 Instagram accounts:** URL cron is fine.

**If you grow to many accounts:** switch to CLI cron (`php sync_yesterday_organic_acc.php`) or split work — same script, no code change.

**Reliability tips:**

- Pick **12:05 AM** (not exactly midnight) in your `config.php` timezone
- Once a week, spot-check Supabase for yesterday’s `instagram_daily_followers` row
- If a run fails, open the test URL manually — it’s idempotent (upserts, no duplicates)

---

## What the scripts do

**Instagram (`sync_yesterday_organic_acc.php`)** — for each `instagram_profiles` row, for **yesterday only**:

- Upserts posts → `past_posts_metrics`
- Upserts follower gain → `instagram_daily_followers`
- Updates profile `followers_count` and `username`

**Ads (`sync_yesterday_ads_acc.php`)** — for each `growth_ad_accounts` row, for **yesterday only**:

- Fetches campaign-level insights from Meta (`spend`, `impressions`, `clicks`, `actions`)
- Upserts rows → `growth_ad_campaign_daily_metrics`

Connect/reconnect in the app still backfills the last **29 days** in the browser (organic + ads).

---

## Files

| File | Purpose |
|------|---------|
| `config.php` | Supabase + cron secret (edit before upload) |
| `sync_yesterday_organic_acc.php` | Instagram organic entry point (URL or CLI) |
| `sync_yesterday_ads_acc.php` | Ad campaign entry point (URL or CLI) |
| `lib/` | Supabase REST + Meta Graph helpers |
| `.htaccess` | Blocks direct access to `config.php` |

## CLI cron (optional)

If your plan supports SSH:

```bash
5 0 * * * /usr/local/bin/php -q /home/USER/public_html/growth-and-analytics/php/sync_yesterday_organic_acc.php >> /home/USER/logs/ig-sync.log 2>&1
```

No `?secret=` needed when run from CLI.
