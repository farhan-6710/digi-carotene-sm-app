-- Migration 007 — when a team member is deleted, reset linked profiles to pending.
-- Sets profiles.role = 'user' and clears profiles.team_member_id.

create or replace function public.handle_team_member_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set role = 'user',
      team_member_id = null
  where team_member_id = old.id;

  return old;
end;
$$;

drop trigger if exists on_team_member_deleted on public.team_members;

create trigger on_team_member_deleted
  before delete on public.team_members
  for each row
  execute function public.handle_team_member_deleted();
