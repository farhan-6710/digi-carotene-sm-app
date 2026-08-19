# Ops: Meta, crons, deploy

---

## Meta / Facebook setup (Growth)

Growth does **not** use per-user Facebook Login. One **central Business Portfolio** owns one **app** and one **system user**. Client Pages, Instagram accounts, and ad accounts are **shared into that portfolio**. Paste the system user’s long-lived token in **Manage Accounts**.

Do **not** create a Meta app per client. Do **not** reuse this Business app for portal “Login with Facebook”.

### One-time setup

1. Open **Meta Business Suite** and create a **Business Portfolio** (the agency’s primary portfolio).
2. In that portfolio create a **Meta app** (type: Business). Add the products you need (Graph / Instagram / Marketing API).
3. Create a **System User** (e.g. `analytics-cron`).
4. **Link the app and the system user** (assign the app to the system user with control).
5. **Add assets** to the system user: the Pages, Instagram accounts, and ad accounts you will sync (share client assets into this portfolio first if they live elsewhere).
6. **Generate a token** for that system user against the app. Use a **long-lived / never-expiring System User token**. Typical scopes:
   - Organic: `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`
   - Ads: `ads_read` (and related ads read permissions as required)
7. Copy the token. In the team portal: **Growth & Analytics → Manage Accounts** → connect organic and/or ads → pick the **client** → paste the **same** token (it works for every asset assigned to that system user).

On connect, the app validates via Graph, stores the account under that `client_id`, and runs a backfill (organic ~29 days of posts + followers; ads ~90 days of campaign/ad set/ad metrics). Nightly PHP crons add yesterday’s rows.

Age / gender / placement breakdowns are **not** stored — fetched live on detail pages. WhatsApp is out of scope for V1.

---

## PHP crons

Folder: [`scripts/php/`](../scripts/php/). Deploy as `public_html/php/` so existing cron URLs stay the same.

| Script | What it does |
|--------|----------------|
| `sync_yesterday_organic_acc.php` | Yesterday’s Instagram post metrics + follower gain for every connected organic account |
| `sync_yesterday_ads_acc.php` | Yesterday’s Meta ads daily metrics (campaign / ad set / ad) |
| `send_midnight_post_digest.php` | Role-based digest **email** (Resend) + in-app `post_digest` notifications for missed / due posts |
| `test.php` | Smoke test (config + auth only) |

Digest section rules: `src/shared/constants/postDigestEmail.ts` (keep `lib/digest.php` in sync). PHP must use `team_members.team_role` (not `role`).

### Auth

| How it runs | Secret |
|-------------|--------|
| PHP CLI (`php script.php`) or Hostinger “PHP” cron with a file path | Not required |
| HTTP / curl | `?secret=` must match `cron_secret` in `config.php` |

### Setup

1. Copy `scripts/php/config.example.php` → `config.php`. Fill Supabase URL + **service_role** key, `cron_secret`, Resend key + from-address. Do not commit `config.php`.
2. Upload the whole `php/` folder to `public_html/php/` (keep existing `config.php` if you already have secrets).
3. Schedule just after midnight **Asia/Kolkata**. If the host is UTC, offset the clock (India midnight ≈ 18:30 UTC). Example (host already on India time):

```bash
5 0 * * *  /usr/local/bin/php -q /home/USER/public_html/php/sync_yesterday_organic_acc.php >> /home/USER/logs/ig-sync.log 2>&1
10 0 * * * /usr/local/bin/php -q /home/USER/public_html/php/sync_yesterday_ads_acc.php >> /home/USER/logs/ads-sync.log 2>&1
15 0 * * * /usr/local/bin/php -q /home/USER/public_html/php/send_midnight_post_digest.php >> /home/USER/logs/post-digest.log 2>&1
```

HTTP (optional): `https://YOUR-DOMAIN.com/php/<script>.php?secret=YOUR_CRON_SECRET`

`php/.htaccess` blocks web access to `config.php` and `lib/`.

---

## Deploy (static + PHP)

There is **no Node server** and **no production `.env`**. `bun run build` bakes the Vite Supabase keys into `dist/`.

Upload to the web root (`public_html/`):

1. **Everything inside `dist/`** after `bun run build` (`index.html`, `assets/`, etc.).
2. **Root `.htaccess`** from the repo (SPA fallback so React Router paths work):

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
</IfModule>
```

3. **`php/`** folder as `public_html/php/` (crons + `config.php`). Do not overwrite `config.php` blindly.

Do not upload `src/`, `node_modules/`, or migrations to the web root. Run SQL in the **Supabase SQL Editor**, not on Hostinger.

Supabase dashboard: add the live site URL and `/auth?form-type=reset-password` to Auth URL allow-list. Google OAuth: authorized redirect `https://<project-ref>.supabase.co/auth/v1/callback`.
