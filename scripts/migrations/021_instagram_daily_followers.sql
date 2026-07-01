-- Migration 021 — Daily follower gain per Instagram profile (backfill + midnight sync).
-- Run once in Supabase SQL Editor after 020.

create table public.instagram_daily_followers (
  id bigserial primary key,
  account_id uuid not null references public.instagram_profiles (id) on delete cascade,
  date date not null,
  followers_gained integer not null default 0,
  unique (account_id, date)
);

create index instagram_daily_followers_account_date_idx
  on public.instagram_daily_followers (account_id, date desc);

alter table public.instagram_daily_followers enable row level security;

create policy "instagram_daily_followers_all"
  on public.instagram_daily_followers for all to anon, authenticated
  using (true) with check (true);
