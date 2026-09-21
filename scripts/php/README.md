# PHP crons

Deploy this folder to `public_html/php/`. Deploy overview: **[docs/deploy.md](../../docs/deploy.md)**. Meta connect + Growth midnight sync: **[docs/meta-integration-growth-and-analytics.md](../../docs/meta-integration-growth-and-analytics.md)**.

| Script | Job |
|--------|-----|
| `sync_last_60_days_org_acc.php` | Instagram organic — last **60** days of posts + **30** days of follower gains (rolling upsert through yesterday) |
| `sync_last_7_days_ad_acc.php` | Meta + Google ad metrics — last **7** completed days (through yesterday) |
| `sync_google_ad_acc_backfill.php` | Google Ads N-day backfill (default 90; triggered on Manage Accounts connect) |
| `send_midnight_post_digest.php` | Digest email + in-app notifications |
| `send_midnight_task_digest.php` | High-priority task digest email + in-app notifications |
| `send_custom_report.php` | Email custom Growth report PDF (Resend attachment; called from Custom Report Builder) |
| `test.php` | Smoke test |

Logic lives under `lib/` (shared) and `sync/organic/`, `sync/ads/` (runners). Root scripts stay thin cron entrypoints.

Copy `config.example.php` → `config.php` (gitignored). Do not overwrite production `config.php` on upload.

## Hostinger cron paths (ops)

After deploy, update Hostinger cron **Command** paths to the new filenames (same `/usr/bin/php …/public_html/php/…` pattern):

| Old (remove from schedule) | New |
| -------------------------- | --- |
| `…/php/sync_yesterday_organic_acc.php` | `…/php/sync_last_60_days_org_acc.php` |
| `…/php/sync_yesterday_ad_acc.php` | `…/php/sync_last_7_days_ad_acc.php` |

Do not keep the old `sync_yesterday_*` scripts scheduled — they are removed from the repo.
