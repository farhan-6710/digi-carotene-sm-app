-- Migration 030 — Move approvals onto production plan items.
-- Plans stay as the parent; each plan can have many items with their own
-- manager / shoot-incharge approval status (status fields only; no workflow yet).

alter table public.production_plans
  drop column if exists manager_approval,
  drop column if exists shoot_incharge_approval;

create table public.production_plan_items (
  id uuid primary key default gen_random_uuid(),
  production_plan_id uuid not null references public.production_plans (id) on delete cascade,
  item_name text not null,
  item_notes text,
  manager_approval text not null default 'pending'
    check (manager_approval in ('pending', 'approved', 'rejected')),
  shoot_incharge_approval text not null default 'pending'
    check (shoot_incharge_approval in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index production_plan_items_plan_id_idx
  on public.production_plan_items (production_plan_id);

create trigger set_production_plan_items_updated_at
  before update on public.production_plan_items
  for each row
  execute function public.handle_updated_at();

alter table public.production_plan_items enable row level security;

create policy "Authenticated users manage production plan items"
  on public.production_plan_items for all to authenticated
  using (true) with check (true);
