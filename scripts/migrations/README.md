# Database migrations

All schema changes go here as **new numbered files**. Do not edit older migrations after they have been applied.

## Brand-new Supabase project

Run **only** [`001_initial_schema.sql`](./001_initial_schema.sql) in the Supabase SQL Editor.

That file creates the full current schema (tables, RLS, triggers, `is_team_member_email`, signup default `user` role).

## Existing project (already has tables)

Run only migrations you have **not** applied yet, in order:

| File | When to run |
|------|-------------|
| `002_rename_profiles_admin_role_to_staff.sql` | `profiles.role` still contains `'admin'` |
| `003_rename_team_members_role_column.sql` | `team_members` still has column `role` (not `admin_team_role`) |
| `004_is_team_member_email_function.sql` | `is_team_member_email()` does not exist |
| `005_signup_default_user_role.sql` | Signup still creates `profiles.role = 'client'` |
| `006_profiles_team_member_id.sql` | `profiles.team_member_id` column missing |
| `007_reset_profile_on_team_member_delete.sql` | Deleting team members does not reset linked profiles |

Also rename `team_members.admin_team_role` → `team_role` in Supabase (Table Editor or SQL) before running app code that expects `team_role`.

Skip any step that is already reflected in your database.

## Adding a new change

1. Create the next file: `008_<short_description>.sql`
2. Document what it does in a header comment
3. Update [`docs/database.md`](../docs/database.md) if the domain model changes

Do **not** recreate monolithic setup/reset scripts.
