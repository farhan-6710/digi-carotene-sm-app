# Database migrations

All schema changes go here as **new numbered files**. Do not edit older migrations after they have been applied.

## Brand-new Supabase project

Run **only** [`001_initial_schema.sql`](./001_initial_schema.sql) in the Supabase SQL Editor.

That file creates the full current schema (tables, RLS, triggers, auto-link by email, signup default `user` role).

## Existing project (already has tables)

Run only migrations you have **not** applied yet, in order:

| File | When to run |
|------|-------------|
| `002_rename_profiles_admin_role_to_team.sql` | `profiles.role` still contains `'admin'` |
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

Also rename `team_members.admin_team_role` → `team_role` in Supabase (Table Editor or SQL) before running app code that expects `team_role`.

Skip any step that is already reflected in your database.

## Adding a new change

1. Create the next file: `009_<short_description>.sql`
2. Document what it does in a header comment
3. Update [`docs/database.md`](../docs/database.md) if the domain model changes

Do **not** recreate monolithic setup/reset scripts.
