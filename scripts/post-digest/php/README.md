# Midnight post digest emails (PHP + Resend)

Runs on **GoDaddy** (PHP 8.2+) the same way as Growth sync: CLI without a secret, or HTTP with `?secret=`.

| Script | What it does |
|--------|----------------|
| `send_midnight_post_digest.php` | Emails today’s / yesterday’s posts per role |
| `test.php` | Smoke test — config + auth only (no emails) |

Section rules (source of truth in the app): [`src/shared/constants/postDigestEmail.ts`](../../../src/shared/constants/postDigestEmail.ts)

| Role | Email content |
|------|----------------|
| `executive` | Today’s to-be-posted posts on projects where they are an **active** `project_team_members` row |
| `manager` | Today’s posts they **manage** + yesterday still **`Not posted`** on those projects |
| `admin` | Yesterday’s **`Not posted`** across **all** projects (one ordered list) |

Empty digests are skipped (no email if there is nothing to list).

## Cron auth (HTTP vs CLI)

| How it runs | Secret required? |
|-------------|------------------|
| **PHP CLI** — `php send_midnight_post_digest.php` | No |
| **Hostinger “PHP” cron** — file path | No (runs as CLI) |
| **HTTP / curl** — `?secret=YOUR_CRON_SECRET` | Yes |

Shared helpers: `lib/bootstrap.php` → `isCronCli()`, `assertCronAccess()`, `cronFail()`.

---

## What you do (checklist)

### 1. Resend account + sending email

1. Sign up at [resend.com](https://resend.com).
2. Add your **work domain** (Domain → Add) and add the DNS records Resend shows (SPF / DKIM).
3. Wait until the domain shows **Verified**.
4. Create an **API key** (API Keys → Create) — copy the `re_…` value once.
5. Decide the **From** address on that domain, e.g. `Digi Carotene <ops@yourcompany.com>` (this is the work email / mailbox identity you send *from*; it does not need to be a full mailbox, but the domain must be verified).

Until the domain is verified, Resend only allows their onboarding test sender — use domain verification for real team digests.

### 2. Edit `config.php`

Open `config.php` in this folder and set:

| Key | Where to get it |
|-----|-----------------|
| `supabase_url` | Same as Growth cron |
| `supabase_service_key` | Supabase → Project Settings → API → **service_role** |
| `cron_secret` | `openssl rand -hex 32` (or reuse Growth’s secret) |
| `resend_api_key` | Resend API key (`re_…`) |
| `resend_from` | Verified address, e.g. `Digi Carotene <ops@yourcompany.com>` |
| `portal_posts_url` | Your live app Posts Management URL |
| `timezone` | Keep `Asia/Kolkata` unless the agency calendar changes |

`timezone` and key names are already in the file. Do **not** commit `config.php` after adding secrets.

### 3. Upload to GoDaddy

Upload the whole `php/` folder, e.g.:

```text
public_html/post-digest/php/
  config.php
  send_midnight_post_digest.php
  test.php
  lib/
  .htaccess
```

### 4. Test

**CLI (recommended):**

```bash
php /home/USER/public_html/post-digest/php/test.php
php /home/USER/public_html/post-digest/php/send_midnight_post_digest.php
```

**HTTP:**

```text
https://YOUR-DOMAIN.com/post-digest/php/test.php?secret=YOUR_CRON_SECRET
https://YOUR-DOMAIN.com/post-digest/php/send_midnight_post_digest.php?secret=YOUR_CRON_SECRET
```

Expect log lines like `Sent to person@… (manager)` or `Skip (no posts): …`.

### 5. Schedule cron (just after midnight India time)

**Recommended — PHP CLI:**

```bash
15 0 * * * /usr/local/bin/php -q /home/USER/public_html/post-digest/php/send_midnight_post_digest.php >> /home/USER/logs/post-digest.log 2>&1
```

**Alternative — URL curl:**

```bash
curl -s "https://YOUR-DOMAIN.com/post-digest/php/send_midnight_post_digest.php?secret=YOUR_CRON_SECRET"
```

Adjust the hour if cPanel server time is not India.

---

## Files

| File | Purpose |
|------|---------|
| `config.php` | Supabase + Resend + cron secret (edit before upload) |
| `send_midnight_post_digest.php` | Entry point |
| `test.php` | Auth/config smoke test |
| `lib/bootstrap.php` | Config, CLI detection, cron auth |
| `lib/supabase.php` | Read team + posts via service role |
| `lib/digest.php` | Role sections + HTML body |
| `lib/resend.php` | Send via Resend API |
| `.htaccess` | Blocks web access to `config.php` / `lib/` |

## Safety

| Do | Don’t |
|----|--------|
| Keep `config.php` only on the server | Put Resend or service_role keys in the React app |
| Use `.htaccess` (included) | Commit filled `config.php` |
| Prefer CLI cron | Share API keys in chat |
