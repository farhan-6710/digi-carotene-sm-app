-- Migration 093 — Organic account last_synced_at for on-demand refetch stale UI.
-- Mirrors growth_ad_accounts.last_synced_at (092). Stamp only after a full successful sync.

alter table public.growth_organic_accounts
  add column if not exists last_synced_at timestamptz;

update public.growth_organic_accounts
set last_synced_at = updated_at
where last_synced_at is null and updated_at is not null;
