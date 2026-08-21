-- Migration 046 — Secondary client contact + task assignee is teammate XOR client.

alter table public.clients
  add column if not exists secondary_contact_name text;

alter table public.clients
  add column if not exists secondary_mobile_number text;

-- Older tasks could have both a team assignee and a client tag.
-- Assign-to is now one person: keep the teammate and clear client_id when both were set.
update public.tasks
set client_id = null
where assigned_to_team_member_id is not null
  and client_id is not null;

alter table public.tasks
  alter column assigned_to_team_member_id drop not null;

alter table public.tasks
  drop constraint if exists tasks_assignee_xor;

alter table public.tasks
  add constraint tasks_assignee_xor check (
    (assigned_to_team_member_id is not null and client_id is null)
    or (assigned_to_team_member_id is null and client_id is not null)
  );
