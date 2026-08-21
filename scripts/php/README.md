# PHP crons

Deploy this folder to `public_html/php/`. Full setup (Meta token, Hostinger schedule, `config.php`): **[docs-2026-08-21/ops.md](../../docs-2026-08-21/ops.md)**.

| Script | Job |
|--------|-----|
| `sync_yesterday_organic_acc.php` | Instagram organic yesterday |
| `sync_yesterday_ads_acc.php` | Meta ads yesterday |
| `send_midnight_post_digest.php` | Digest email + in-app notifications |
| `test.php` | Smoke test |

Copy `config.example.php` → `config.php` (gitignored). Do not overwrite production `config.php` on upload.
