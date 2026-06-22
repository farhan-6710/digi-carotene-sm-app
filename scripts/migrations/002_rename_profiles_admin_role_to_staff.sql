-- Migration 002 — existing databases only.
-- Renames profiles.role login type 'admin' → 'staff'.
-- Skip if you ran 001_initial_schema.sql (already uses 'staff').
--
-- Sequence: relax constraint → migrate rows → tighten constraint → RLS.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'staff', 'client', 'user'));

update public.profiles
  set role = 'staff'
  where role = 'admin';

alter table public.profiles
  drop constraint profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('staff', 'client', 'user'));

drop policy if exists "Admins update any profile" on public.profiles;
drop policy if exists "Staff update any profile" on public.profiles;

create policy "Staff update any profile"
  on public.profiles for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'staff'
    )
  );
