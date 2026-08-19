-- Rename item notes to script; add reference link and client approval.

alter table public.production_plan_items
  rename column item_notes to script;

alter table public.production_plan_items
  add column reference_link text,
  add column client_approval text not null default 'pending'
    check (client_approval in ('pending', 'approved', 'rejected'));
