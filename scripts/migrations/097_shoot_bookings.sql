-- Migration 097 — Shoot slot bookings (client portal "Book a shoot").
-- A client picks a date, start time and end time. One shoot team, so active
-- bookings may touch but never overlap (exclusion constraint = no double-book,
-- even if two clients confirm at the same moment).
-- Statuses: booked → completed (team) | cancelled (client or team).

create table public.shoot_bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  production_plan_id uuid references public.production_plans (id) on delete set null,
  shoot_date date not null,
  start_time time not null,
  end_time time not null,
  notes text,
  status text not null default 'booked'
    check (status in ('booked', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shoot_bookings_end_after_start check (end_time > start_time),
  constraint shoot_bookings_no_overlap
    exclude using gist (
      tsrange(shoot_date + start_time, shoot_date + end_time, '[)') with &&
    ) where (status <> 'cancelled')
);

create index shoot_bookings_client_id_idx on public.shoot_bookings (client_id);
create index shoot_bookings_shoot_date_idx on public.shoot_bookings (shoot_date);

create trigger set_shoot_bookings_updated_at
  before update on public.shoot_bookings
  for each row
  execute function public.handle_updated_at();

alter table public.shoot_bookings enable row level security;

create policy "Team manage shoot bookings"
  on public.shoot_bookings for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());

create policy "Portal users read own shoot bookings"
  on public.shoot_bookings for select to authenticated
  using (client_id = public.current_profile_client_id());

-- Clients book for themselves, only in the future (India time).
create policy "Portal users create own shoot bookings"
  on public.shoot_bookings for insert to authenticated
  with check (
    client_id = public.current_profile_client_id()
    and status = 'booked'
    and shoot_date + start_time > (now() at time zone 'Asia/Kolkata')
  );

-- Clients can cancel their own upcoming bookings.
create policy "Portal users cancel own shoot bookings"
  on public.shoot_bookings for update to authenticated
  using (
    client_id = public.current_profile_client_id()
    and status = 'booked'
  )
  with check (
    client_id = public.current_profile_client_id()
    and status in ('booked', 'cancelled')
  );

-- Busy times across every client (no client details) so the picker can hide
-- taken slots. Clients cannot select other clients' rows, hence the function.
create or replace function public.fetch_shoot_busy_slots(p_from date, p_to date)
returns table (shoot_date date, start_time time, end_time time)
language sql
stable
security definer
set search_path = public
as $$
  select b.shoot_date, b.start_time, b.end_time
  from public.shoot_bookings b
  where b.status <> 'cancelled'
    and b.shoot_date between p_from and p_to
  order by b.shoot_date, b.start_time;
$$;

grant execute on function public.fetch_shoot_busy_slots(date, date) to authenticated;
