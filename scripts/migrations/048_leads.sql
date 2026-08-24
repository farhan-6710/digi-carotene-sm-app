-- Migration 048 — CRM leads (V1).
-- Flat table + simple filters. No RPCs or activity log.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  industry text,
  lead_score integer not null default 1
    check (lead_score between 1 and 5),
  status text not null default 'not_contacted'
    check (status in (
      'attempted_to_contact',
      'contact_in_future',
      'contacted',
      'junk_lead',
      'lost_lead',
      'not_contacted',
      'pre_qualified',
      'not_qualified'
    )),
  lead_source text not null default 'cold_call'
    check (lead_source in (
      'advertisement',
      'cold_call',
      'employee_referral',
      'external_referral',
      'online_store',
      'partner',
      'public_relations',
      'sales_email_alias',
      'seminar_partner',
      'internal_seminar',
      'trade_show',
      'web_download',
      'web_research',
      'chat',
      'x_twitter',
      'facebook'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads (status);
create index leads_created_at_idx on public.leads (created_at desc);

create trigger set_leads_updated_at
  before update on public.leads
  for each row
  execute function public.handle_updated_at();

alter table public.leads enable row level security;

create policy "Authenticated users manage leads"
  on public.leads for all to authenticated
  using (true) with check (true);
