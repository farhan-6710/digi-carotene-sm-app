-- Migration 083 — Lead follow-ups (V1).
-- Date required, time optional (empty string). Status: pending | didnt_respond | done.

create table if not exists public.lead_follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  follow_up_date date not null,
  follow_up_time text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'didnt_respond', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_follow_ups_lead_id_idx
  on public.lead_follow_ups (lead_id);

create index if not exists lead_follow_ups_date_idx
  on public.lead_follow_ups (follow_up_date);

create trigger set_lead_follow_ups_updated_at
  before update on public.lead_follow_ups
  for each row
  execute function public.handle_updated_at();

alter table public.lead_follow_ups enable row level security;

create policy "Authenticated users manage lead follow ups"
  on public.lead_follow_ups for all to authenticated
  using (true) with check (true);
