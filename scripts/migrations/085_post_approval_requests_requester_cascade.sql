-- Migration 085 — Allow removing a team member who requested post approvals.
-- Deletes their approval request rows with them (history of that requester).
-- Does not delete other team members or unrelated approvals.

alter table public.post_approval_requests
  drop constraint if exists post_approval_requests_requested_by_team_member_id_fkey;

alter table public.post_approval_requests
  add constraint post_approval_requests_requested_by_team_member_id_fkey
  foreign key (requested_by_team_member_id)
  references public.team_members (id)
  on delete cascade;
