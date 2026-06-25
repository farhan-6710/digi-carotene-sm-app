-- Migration 002 — existing databases only.
-- Renames profiles.role login type 'admin' → 'team'.
-- Skip if you ran 001_initial_schema.sql (already uses 'team').
--
-- Sequence: relax constraint → migrate rows → tighten constraint → RLS.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'team', 'client', 'user'));

update public.profiles
  set role = 'team'
  where role = 'admin';

alter table public.profiles
  drop constraint profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('team', 'client', 'user'));

drop policy if exists "Admins update any profile" on public.profiles;
drop policy if exists "Team update any profile" on public.profiles;

create policy "Team update any profile"
  on public.profiles for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'team'
    )
  );
