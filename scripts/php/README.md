# PHP crons

Deploy this folder to `public_html/php/`. Deploy overview: **[docs/deploy.md](../../docs/deploy.md)**. Meta connect + Growth midnight sync: **[docs/meta-integration-growth-and-analytics.md](../../docs/meta-integration-growth-and-analytics.md)**.

| Script | Job |
|--------|-----|
| `sync_yesterday_organic_acc.php` | Instagram organic yesterday |
| `sync_yesterday_ad_acc.php` | Meta + Google ad account metrics (yesterday) |
| `sync_google_ad_acc_backfill.php` | Google Ads N-day backfill (default 90; triggered on Manage Accounts connect) |
| `send_midnight_post_digest.php` | Digest email + in-app notifications |
| `send_midnight_task_digest.php` | High-priority task digest email + in-app notifications |
| `test.php` | Smoke test |

Copy `config.example.php` → `config.php` (gitignored). Do not overwrite production `config.php` on upload.
