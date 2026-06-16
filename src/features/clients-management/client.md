# Clients Management — Supabase Setup

This file contains the SQL queries to set up and manage your `clients` table in Supabase, featuring both `created_at` and `updated_at` fields with automated trigger-based updates.

---

## 1. Helper Function for `updated_at` (Run once)

If you haven't run this function yet from the posts setup, run it once in your SQL Editor:

```sql
-- Create trigger function to automatically update the updated_at column on edit
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

---

## 2. Create the `clients` Table

Run this SQL to create the `clients` table and set up the automated `updated_at` trigger:

```sql
-- Create the clients table
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  mobile_number text,
  website_name text,
  socials jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Attach the updated_at trigger to the clients table
create trigger set_clients_updated_at
  before update on public.clients
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.clients enable row level security;
```

---

## 3. Row Level Security (RLS) Policies

You have two options for setting up security policies. Pick **ONE** of the options below:

### Option A: Ultra-Simple Unified Policy (Highly Recommended)
This covers all CRUD operations under a single, highly readable policy:

```sql
create policy "Logged-in users can manage clients"
  on public.clients for all
  to authenticated
  using (true)
  with check (true);
```

---

## 4. Deleting clients linked to portal users

If delete fails with `profiles_client_id_fkey`, a row in `public.profiles` still points at that client (often from the link script — e.g. brands named after user display names).

**Fix (run once):** `scripts/clients-fk-on-delete-set-null.sql` — clears `profiles.client_id` automatically when a client is deleted.

**Optional:** `scripts/profiles-admin-update-rls.sql` — lets admins unlink profiles from the app before delete.

Real brands should stay in `clients`; auto-created user-name rows (Sai, Farhan Ahmed, etc.) can be removed after you promote admins and link real portal users to proper brands.

---

## 5. Explanation of Fields

| Column Name | Type | Nullable | Default | Description |
|-------------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Unique identifier for each client. |
| `client_name` | text | No | — | Name of the client (Mandatory). |
| `mobile_number`| text | Yes | — | Mobile phone number of the client (Optional). |
| `website_name` | text | Yes | — | Website name or URL of the client (Optional). |
| `socials` | jsonb | No | `'{}'::jsonb` | JSON object containing social links (`facebook`, `instagram`, `linkedin`, `youtube`). |
| `created_at` | timestamptz | No | `now()` | Timestamp of record creation. |
| `updated_at` | timestamptz | No | `now()` | Timestamp of the last edit. Automatically updated. |
