-- Run once in Supabase SQL Editor (existing databases only).
-- Allows passwordless signup to detect pre-added team members by email.

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
