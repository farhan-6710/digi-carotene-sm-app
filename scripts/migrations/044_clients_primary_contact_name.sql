-- Migration 044 — Primary contact person for a client's mobile number.

alter table public.clients
  add column if not exists primary_contact_name text;
