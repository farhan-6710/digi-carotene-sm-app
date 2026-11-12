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
| `FTP_HOST` / `FTP_USERNAME` / `FTP_PASSWORD` | Hostinger FTP (use hPanel FTP hostname/IP, not a Cloudflare-proxied domain; CI uses FTPS on port 21) |
| `VITE_SUPABASE_URL` | Baked into JS at build time |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Baked into JS at build time (anon key) |
| `VITE_GROWTH_PHP_BASE_URL` | Hostinger PHP base URL, e.g. `https://digicarotene.in/php` (custom report email) |
| `VITE_GROWTH_PHP_CRON_SECRET` | Same as `php/config.php` `cron_secret` (custom report email) |

Without the two Supabase `VITE_*` secrets, CI builds a blank app — `supabaseClient` throws and `#root` stays empty. Custom report email needs the two Growth PHP secrets (Meta/Google sync is browser TypeScript — no PHP).

## After deploy

Supabase dashboard: add the live site URL and `/auth?form-type=reset-password` to Auth URL allow-list. Google OAuth: authorized redirect `https://<project-ref>.supabase.co/auth/v1/callback`.

Meta + Google Ads connect and on-demand refetch: [growth-integrations.md](./growth-integrations.md).

### Hostinger cron Commands

| Job | Command script |
| --- | --- |
| Post digest | `public_html/php/send_midnight_post_digest.php` |
| Task digest | `public_html/php/send_midnight_task_digest.php` |

Growth Meta/Google sync is **browser TypeScript** (connect + Refetch). PHP is email-only (`send_custom_report.php` is app-triggered).
