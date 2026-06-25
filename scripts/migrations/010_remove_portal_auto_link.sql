-- Migration 010 — remove portal auto-link (009/010 draft); keep clients.email.
-- Run this if you applied an earlier 009/010 that added link_profile_by_email triggers.

drop trigger if exists on_team_member_portal_link on public.team_members;
drop trigger if exists on_client_portal_link on public.clients;
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_team_member_portal_link();
drop function if exists public.handle_client_portal_link();
drop function if exists public.link_profile_by_email(text);
drop function if exists public.ensure_my_profile();

drop function if exists public.grant_team_access_by_email(text, uuid);
drop function if exists public.grant_client_access_by_email(text, uuid);
drop function if exists public.sync_my_portal_access();
drop function if exists public.is_team_caller();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, client_id, team_member_id)
  values (new.id, 'user', null, null)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- clients.email is kept (added by 009_clients_email.sql).
