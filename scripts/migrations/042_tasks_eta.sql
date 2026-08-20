-- Migration 042 — Tasks ETA date/time; drop is_blocker.
-- ETA is the estimated deadline (same date + time pattern as posts).

alter table public.tasks
  drop column if exists is_blocker;

alter table public.tasks
  add column if not exists eta_date date,
  add column if not exists eta_time text;

-- Existing rows (if any) get a temporary ETA; new tasks require both in the app.
update public.tasks
set
  eta_date = coalesce(eta_date, (created_at at time zone 'utc')::date),
  eta_time = coalesce(eta_time, '10:00 AM')
where eta_date is null or eta_time is null;

alter table public.tasks
  alter column eta_date set not null,
  alter column eta_time set not null;
