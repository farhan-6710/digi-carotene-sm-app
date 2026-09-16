# Deploy

There is **no Node server** and **no production `.env`**. `bun run build` bakes the Vite Supabase keys into `dist/`.

## What to upload

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
4. **`docs/`** folder as `public_html/docs/` (optional; included by CI).

Do not upload `src/`, `node_modules/`, or migrations to the web root. Run SQL in the **Supabase SQL Editor**, not on Hostinger.

## GitHub Actions deploy

Workflow: `.github/workflows/deploy.yml` (push to `main` → build → FTP to `public_html/`).

Repo **Settings → Secrets and variables → Actions** must include:

| Secret | Used for |
|--------|----------|
| `FTP_HOST` / `FTP_USERNAME` / `FTP_PASSWORD` | Hostinger FTP |
| `VITE_SUPABASE_URL` | Baked into JS at build time |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Baked into JS at build time (anon key) |
| `VITE_GROWTH_PHP_BASE_URL` | Hostinger PHP base URL, e.g. `https://digicarotene.in/php` (Google Ads connect backfill) |
| `VITE_GROWTH_PHP_CRON_SECRET` | Same as `php/config.php` `cron_secret` (Google Ads connect backfill) |

Without the two Supabase `VITE_*` secrets, CI builds a blank app — `supabaseClient` throws and `#root` stays empty. Google Ads connect also needs the two Growth PHP secrets or the 90-day backfill step fails after insert.

## After deploy

Supabase dashboard: add the live site URL and `/auth?form-type=reset-password` to Auth URL allow-list. Google OAuth: authorized redirect `https://<project-ref>.supabase.co/auth/v1/callback`.

Meta client connect + midnight Growth sync: [meta-integration-growth-and-analytics.md](./meta-integration-growth-and-analytics.md).

Google Ads connect (MCC / OAuth fields): [google-ads-integration.md](./google-ads-integration.md).

### Hostinger Growth cron Commands

Point midnight sync crons at the rolling refresh scripts (update paths after deploy if still on the old names):

| Job | Command script |
| --- | --- |
| Organic (60d posts / 30d followers) | `public_html/php/sync_last_60_days_org_acc.php` |
| Ads Meta + Google (7d) | `public_html/php/sync_last_7_days_ad_acc.php` |

Remove any schedule still pointing at `sync_yesterday_organic_acc.php` / `sync_yesterday_ad_acc.php` (removed from the repo).
