# PHP scripts (Hostinger) — email only

Deploy this folder to `public_html/php/`. Deploy overview: **[docs/deploy.md](../../docs/deploy.md)**.

Growth Meta + Google sync runs in the **browser (TypeScript)**. PHP is only for Resend emails.

| Script | Job |
|--------|-----|
| `send_midnight_post_digest.php` | Digest email + in-app notifications |
| `send_midnight_task_digest.php` | High-priority task digest email + in-app notifications |
| `send_custom_report.php` | Email custom Growth report PDF (called from Custom Report Builder) |

Copy `config.example.php` → `config.php` (gitignored). Do not overwrite production `config.php` on upload.

## Hostinger cron paths (ops)

| Job | Command script |
| --- | --- |
| Post digest | `public_html/php/send_midnight_post_digest.php` |
| Task digest | `public_html/php/send_midnight_task_digest.php` |

App-triggered (not midnight): `send_custom_report.php` via `VITE_GROWTH_PHP_BASE_URL` + `VITE_GROWTH_PHP_CRON_SECRET`.
