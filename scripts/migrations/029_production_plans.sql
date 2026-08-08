-- Migration 029 — Production Planner (V1).
-- Adds production_plans table, RLS, triggers, and checking rules.

create table public.production_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  plan_name text not null,
  plan_description text,
  start_date date not null,
  reels_count integer not null default 0 check (reels_count >= 0),
  images_count integer not null default 0 check (images_count >= 0),
  carousels_count integer not null default 0 check (carousels_count >= 0),
  manager_approval text not null default 'pending'
    check (manager_approval in ('pending', 'approved', 'rejected')),
  shoot_incharge_approval text not null default 'pending'
    check (shoot_incharge_approval in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_production_plans_updated_at
  before update on public.production_plans
  for each row
  execute function public.handle_updated_at();

alter table public.production_plans enable row level security;

create policy "Authenticated users manage production plans"
  on public.production_plans for all to authenticated
  using (true) with check (true);
