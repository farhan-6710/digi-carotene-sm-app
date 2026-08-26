-- Migration 054 — Lead address + notes (V1).
-- Flat address on leads; simple lead_notes table.

alter table public.leads
  add column if not exists address text;

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_lead_notes_updated_at
  before update on public.lead_notes
  for each row
  execute function public.handle_updated_at();

alter table public.lead_notes enable row level security;

create policy "Authenticated users manage lead notes"
  on public.lead_notes for all to authenticated
  using (true) with check (true);
