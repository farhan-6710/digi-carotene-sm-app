-- Migration 084 — Optional note on lead follow-ups.

alter table public.lead_follow_ups
  add column if not exists note text;
