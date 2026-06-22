-- Migration 006 — link profiles to team_members via team_member_id.
-- Run after renaming team_members.admin_team_role → team_role in Supabase.
-- Backfills team_member_id for existing auth users whose email matches team_members.

alter table public.profiles
  add column if not exists team_member_id uuid references public.team_members (id) on delete set null;

-- For each profile: look up auth email → find matching team_members row → store its id.
update public.profiles p
set team_member_id = (
  select tm.id
  from public.team_members tm
  where lower(trim(tm.email)) = lower(trim((
    select u.email from auth.users u where u.id = p.id
  )))
  limit 1
)
where p.team_member_id is null;
