-- Migration 005 — existing databases only.
-- New signups get profiles.role = 'user' until team or client access is granted.
-- Skip if you ran 001_initial_schema.sql (trigger already uses 'user').

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, client_id)
  values (new.id, 'user', null)
  on conflict (id) do nothing;
  return new;
end;
$$;

alter table public.profiles
  alter column role set default 'user';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('team', 'client', 'user'));
