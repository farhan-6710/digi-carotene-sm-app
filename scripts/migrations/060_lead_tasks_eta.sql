-- Migration 060 — Lead tasks ETA date + time (V1).

alter table public.lead_tasks
  add column if not exists eta_date date,
  add column if not exists eta_time text;

update public.lead_tasks
set
  eta_date = coalesce(eta_date, (created_at at time zone 'utc')::date),
  eta_time = coalesce(eta_time, '09:00 AM')
where eta_date is null or eta_time is null;

alter table public.lead_tasks
  alter column eta_date set not null,
  alter column eta_time set not null;
