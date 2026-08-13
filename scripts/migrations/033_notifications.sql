-- Migration 033 — team inbox notifications (V1).
-- Workflow stays in post_approval_requests; this table is read/dismiss inbox only.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_team_member_id uuid not null
    references public.team_members (id) on delete cascade,
  notification_type text not null
    check (notification_type in ('approval', 'post_digest')),
  title text not null,
  message text not null,
  status text not null default 'unread'
    check (status in ('unread', 'read')),
  related_id uuid,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index notifications_recipient_status_created_idx
  on public.notifications (recipient_team_member_id, status, created_at desc);

alter table public.notifications enable row level security;

create policy "Authenticated users manage notifications"
  on public.notifications for all to authenticated
  using (true) with check (true);
