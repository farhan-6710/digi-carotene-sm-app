-- Migration 079 — Rename growth_ad_accounts.login_customer_id → manager_id.
-- Digi name for Digi Carotene MCC id; Google Ads API header stays login-customer-id.

alter table public.growth_ad_accounts
  rename column login_customer_id to manager_id;
