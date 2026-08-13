# Hostinger / GoDaddy PHP crons (Growth sync + midnight post digest)

One folder → deploy to `public_html/php/` so existing cron URLs stay the same.

| Script | What it does |
|--------|----------------|
| `sync_yesterday_organic_acc.php` | Instagram organic posts + follower gain |
| `sync_yesterday_ads_acc.php` | Meta ads daily metrics |
| `send_midnight_post_digest.php` | Role-based post digest emails (Resend) + in-app `post_digest` notifications |
| `test.php` | Smoke test — config + auth only |

Section rules for digests: [`src/shared/constants/postDigestEmail.ts`](../../src/shared/constants/postDigestEmail.ts)

## Cron auth (HTTP vs CLI)

| How it runs | Secret required? |
|-------------|------------------|
| **PHP CLI** — `php script.php` | No |
| **Hostinger “PHP” cron** — file path | No (runs as CLI) |
| **HTTP / curl** — `?secret=YOUR_CRON_SECRET` | Yes |

## Setup

1. Copy `config.example.php` → `config.php` and fill Supabase, cron secret, Resend key + from.
2. Upload this whole `php/` folder to `public_html/php/` (merge into existing if already there).
3. Schedule crons (just after midnight India time):

```bash
5 0 * * *  /usr/local/bin/php -q /home/USER/public_html/php/sync_yesterday_organic_acc.php >> /home/USER/logs/ig-sync.log 2>&1
10 0 * * * /usr/local/bin/php -q /home/USER/public_html/php/sync_yesterday_ads_acc.php >> /home/USER/logs/ads-sync.log 2>&1
15 0 * * * /usr/local/bin/php -q /home/USER/public_html/php/send_midnight_post_digest.php >> /home/USER/logs/post-digest.log 2>&1
```

**HTTP examples** (same path prefix):

```text
https://YOUR-DOMAIN.com/php/sync_yesterday_organic_acc.php?secret=YOUR_CRON_SECRET
https://YOUR-DOMAIN.com/php/sync_yesterday_ads_acc.php?secret=YOUR_CRON_SECRET
https://YOUR-DOMAIN.com/php/send_midnight_post_digest.php?secret=YOUR_CRON_SECRET
https://YOUR-DOMAIN.com/php/test.php?secret=YOUR_CRON_SECRET
```

## Folder layout

```text
php/
  config.example.php
  config.php                 (gitignored — secrets)
  test.php
  sync_yesterday_organic_acc.php
  sync_yesterday_ads_acc.php
  send_midnight_post_digest.php
  .htaccess
  lib/
    bootstrap.php
    supabase.php
    meta.php
    digest.php
    resend.php
```

Do **not** commit `config.php` after adding secrets.
