-- Migration 004 — existing databases only.
-- Adds is_team_member_email() for passwordless signup team detection.
-- Skip if you ran 001_initial_schema.sql (function already included).

create or replace function public.is_team_member_email(lookup_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members
    where lower(trim(email)) = lower(trim(lookup_email))
  );
$$;

grant execute on function public.is_team_member_email(text) to anon, authenticated;
