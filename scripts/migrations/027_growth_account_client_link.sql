-- Migration 027 — link connected growth accounts to a client.
--
-- The team connects organic (Facebook Page / Instagram) and ad accounts in the
-- team portal and now picks which client each account belongs to. The client
-- portal will read only the accounts where client_id = the logged-in user's
-- client_id, so a client sees only their own data regardless of login method.
--
-- Additive and simple: one nullable FK column per table. No backfill.
-- ON DELETE SET NULL keeps synced metrics history if a client is removed.

alter table public.growth_organic_accounts
  add column if not exists client_id uuid references public.clients (id) on delete set null;

alter table public.growth_ad_accounts
  add column if not exists client_id uuid references public.clients (id) on delete set null;

create index if not exists growth_organic_accounts_client_id_idx
  on public.growth_organic_accounts (client_id);

create index if not exists growth_ad_accounts_client_id_idx
  on public.growth_ad_accounts (client_id);
