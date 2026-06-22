-- Migration 003 — existing databases only.
-- Renames team_members.role → admin_team_role (distinct from profiles.role).
-- Skip if you ran 001_initial_schema.sql (already uses admin_team_role).

alter table public.team_members
  rename column role to admin_team_role;

alter table public.team_members
  drop constraint if exists team_members_role_check;

alter table public.team_members
  add constraint team_members_admin_team_role_check
  check (admin_team_role in ('executive', 'manager', 'admin'));

alter table public.team_members
  alter column admin_team_role set default 'executive';
