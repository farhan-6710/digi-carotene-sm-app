-- Rename team_role `executive` → `sm_executive` and add `editor`.
-- UI label for editor: "Editor/Designer".
--
-- Drop every known legacy check name — older DBs may still have
-- team_members_role_check (from when the column was named `role`) or
-- team_members_admin_team_role_check (from migration 003).

alter table public.team_members
  drop constraint if exists team_members_team_role_check;

alter table public.team_members
  drop constraint if exists team_members_role_check;

alter table public.team_members
  drop constraint if exists team_members_admin_team_role_check;

update public.team_members
set team_role = 'sm_executive'
where team_role = 'executive';

alter table public.team_members
  alter column team_role set default 'sm_executive';

alter table public.team_members
  drop constraint if exists team_members_team_role_check;

alter table public.team_members
  add constraint team_members_team_role_check
  check (team_role in ('sm_executive', 'editor', 'manager', 'admin'));
