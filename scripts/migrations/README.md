# Database migrations

All schema changes go here as **new numbered files**. Do not edit older migrations after they have been applied.

## Brand-new Supabase project

Run **only** [`001_initial_schema.sql`](./001_initial_schema.sql) in the Supabase SQL Editor.

That file creates the full current schema (tables, RLS, triggers, auto-link by email, signup default `user` role).

## Existing project (already has tables)

Run only migrations you have **not** applied yet, in order:

| File | When to run |
|------|-------------|
| `002_rename_profiles_admin_role_to_staff.sql` | `profiles.role` still contains `'admin'` (renames it to `'team'`) |
| `003_rename_team_members_role_column.sql` | `team_members` still has column `role` (not `admin_team_role`) |
| `004_is_team_member_email_function.sql` | `is_team_member_email()` does not exist |
| `005_signup_default_user_role.sql` | Signup still creates `profiles.role = 'client'` |
| `006_profiles_team_member_id.sql` | `profiles.team_member_id` column missing |
| `007_reset_profile_on_team_member_delete.sql` | Deleting team members does not reset linked profiles |
| `008_reset_profile_on_client_delete_and_realtime.sql` | Client delete + instant profile sync (realtime) |
| `009_clients_email.sql` | `clients.email` column + unique index |
| `010_remove_portal_auto_link.sql` | Remove auto-link triggers/RPCs only (if an old 009 draft was applied) |
| `011_auto_link_profiles_by_email.sql` | DB triggers: link profile on team member / client save or signup |
| `012_rename_scheduled_to_to_be_posted.sql` | Rename `scheduled_date/time` → `to_be_posted_date/time`; clear stale posted fields |
| `013_post_approval_requests.sql` | Backdated post approval requests for executives |
| `015_ensure_profile_link_triggers.sql` | Re-create profile auto-link triggers + signup hook; ensure `link_profile_by_email` sets `profiles.role = 'team'` and grant its execute (idempotent) |
| `016_growth_and_analytics.sql` | Growth & Analytics tables (schema only, no seed data) with anon-accessible RLS |
| `017_growth_account_unique.sql` | Unique constraints on growth account Meta IDs |
| `018_instagram_growth_phase1.sql` | Drops legacy growth metric tables; adds `instagram_profiles` + `past_posts_metrics` (renamed in `028`) |
| `019_past_posts_reposts.sql` | Adds `reposts` column to `past_posts_metrics` |
| `020_past_posts_thumbnail.sql` | Adds `post_thumbnail` column to `past_posts_metrics` |
| `021_instagram_daily_followers.sql` | Daily follower gain per Instagram profile (backfill + cron) |
| `022_ad_campaign_metrics.sql` | Campaign daily metrics + currency on ad accounts |
| `023_ad_campaign_objective.sql` | Adds `objective` to campaign daily metrics |
| `024_ad_campaign_reach_cpm_frequency.sql` | Adds reach / CPM / frequency to campaign daily metrics |
| `025_ad_adset_tables.sql` | Ad set + ad master/daily metric tables |
| `026_posts_post_type.sql` | Posts `post_type` column |
| `027_growth_account_client_link.sql` | Adds nullable `client_id` FK to organic + ads account tables |
| `028_rename_growth_tables.sql` | Renames Growth tables to `growth_organic_*` / `growth_ads_*` prefixes |
| `029_production_plans.sql` | Adds `production_plans` table for the Production Planner feature |
| `030_production_plan_items.sql` | Moves approvals onto `production_plan_items`; drops plan-level approval columns |
| `031_production_plan_assignees.sql` | Adds `manager_id` + `shoot_incharge_id` on `production_plans` |
| `032_production_plans_shoot_date.sql` | Renames `production_plans.start_date` → `shoot_date` |
| `033_notifications.sql` | Team inbox `notifications` (approval alerts + post digests) |
| `034_clients_projects_is_active.sql` | Adds `is_active` on `clients` and `projects` |
| `035_production_plan_team_members.sql` | Extra team on a production plan (`ended_at` for history) |
| `036_production_plan_items_script_and_client_approval.sql` | Renames `item_notes` → `script`; adds `reference_link` + `client_approval` |
| `037_share_tokens.sql` | `share_token` on projects + production plans; public fetch RPCs |
| `038_drop_shared_plan_approval_rpc.sql` | Drops unused share-link approval RPC (approvals stay in the client portal) |
| `039_ensure_share_token_rpc.sql` | Drops unused `ensure_share_token` if it was created |
| `040_tasks.sql` | `tasks` + `task_tags`; project-scoped task management |
| `041_notifications_task_type.sql` | Extends `notifications.notification_type` with `'task'` |
| `042_tasks_eta.sql` | Adds required `eta_date` + `eta_time`; drops `is_blocker` |
| `043_task_messages.sql` | Simple task chat messages (`task_messages`) |
| `044_clients_primary_contact_name.sql` | Adds `primary_contact_name` on clients |
| `045_tasks_client_id.sql` | Adds nullable `client_id` on tasks |
| `046_clients_secondary_contact_and_task_assignee.sql` | Secondary contact on clients; task assignee can be client |
| `047_tasks_priority_low_medium_high.sql` | Task priority: `low` \| `medium` \| `high` |
| `048_leads.sql` | CRM `leads` table (name, company, email, phone, industry, lead score, status, lead source) |
| `049_leads_industry_score_enums.sql` | If you already ran the first 048: add industry + lead_score; expand status/source enums |
| `050_task_dependency_client.sql` | Optional `tasks.dependency_client_id` so a project client can be a task dependency |
| `060_lead_tasks_eta.sql` | ETA fields on lead tasks |
| `061_team_todos.sql` | Team dashboard personal todos |
| `062_leads_tags.sql` | Free-form `tags text[]` on leads |
| `063_notifications_task_digest_type.sql` | Adds `task_digest` to `notifications.notification_type` |

Also rename `team_members.admin_team_role` → `team_role` in Supabase (Table Editor or SQL) before running app code that expects `team_role`.

Skip any step that is already reflected in your database.

## Adding a new change

1. Create the next file: `009_<short_description>.sql`
2. Document what it does in a header comment
3. Update [`docs-2026-08-27/database.md`](../docs-2026-08-27/database.md) if tables or relationships change.

Do **not** recreate monolithic setup/reset scripts.
