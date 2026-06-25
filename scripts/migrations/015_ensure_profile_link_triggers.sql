-- Migration 015 — ensure profile auto-link triggers, signup hook, and RPC grant.
-- Run if team member create does not set profiles.role = 'team' / team_member_id.
-- Safe to re-run (idempotent).

create or replace function public.link_profile_by_email(lookup_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id uuid;
  tm_id uuid;
  cl_id uuid;
begin
  if lookup_email is null or trim(lookup_email) = '' then
    return;
  end if;

  select id into user_id
  from auth.users
  where lower(trim(email)) = lower(trim(lookup_email));

  if user_id is null then
    return;
  end if;

  insert into public.profiles (id, role, client_id, team_member_id)
  values (user_id, 'user', null, null)
  on conflict (id) do nothing;

  select id into tm_id
  from public.team_members
  where lower(trim(email)) = lower(trim(lookup_email))
  limit 1;

  if tm_id is not null then
    update public.profiles
    set role = 'team',
        team_member_id = tm_id,
        client_id = null
    where id = user_id;
    return;
  end if;

  select id into cl_id
  from public.clients
  where email is not null
    and lower(trim(email)) = lower(trim(lookup_email))
  limit 1;

  if cl_id is not null then
    update public.profiles
    set role = 'client',
        client_id = cl_id,
        team_member_id = null
    where id = user_id;
  end if;
end;
$$;

grant execute on function public.link_profile_by_email(text) to authenticated;

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

  perform public.link_profile_by_email(new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.handle_team_member_portal_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.link_profile_by_email(new.email);
  return new;
end;
$$;

drop trigger if exists on_team_member_portal_link on public.team_members;
create trigger on_team_member_portal_link
  after insert or update of email on public.team_members
  for each row
  execute function public.handle_team_member_portal_link();

create or replace function public.handle_client_portal_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.link_profile_by_email(new.email);
  return new;
end;
$$;

drop trigger if exists on_client_portal_link on public.clients;
create trigger on_client_portal_link
  after insert or update of email on public.clients
  for each row
  execute function public.handle_client_portal_link();

-- Backfill any auth users whose email already matches roster.
do $$
declare
  auth_email text;
begin
  for auth_email in
    select u.email
    from auth.users u
    where u.email is not null
  loop
    perform public.link_profile_by_email(auth_email);
  end loop;
end;
$$;
