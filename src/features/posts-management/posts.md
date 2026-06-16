# Posts Management — Supabase Setup

This file contains the SQL queries to completely set up and recreate your `posts` table in Supabase, featuring both `created_at` and `updated_at` fields with automated trigger-based updates.

---

## 1. Helper Function for `updated_at` (Run once)

Run this helper function once so that Postgres can automatically manage the `updated_at` timestamps on any table we connect it to.

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

## 2. Create the `posts` Table

Run this SQL to create the `posts` table and set up the automated `updated_at` trigger:

```sql
-- Create the posts table
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  post_title text,
  socials text[],
  post_links jsonb not null default '{}'::jsonb,
  scheduled_date date not null,
  scheduled_time text not null,
  posted_date date,
  posted_time text,
  status text not null check (status in ('Not posted', 'Scheduled', 'Posted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Attach the updated_at trigger to the posts table
create trigger set_posts_updated_at
  before update on public.posts
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;
```

---

## 3. Row Level Security (RLS) Policies

You have two options for setting up security policies. Pick **ONE** of the options below:

### Option A: Ultra-Simple Unified Policy (Highly Recommended)
This covers all CRUD operations under a single, highly readable policy:

```sql
create policy "Logged-in users can manage posts"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);
```

---

## 4. Explanation of Fields

| Column Name | Type | Nullable | Default | Description |
|-------------|------|----------|---------|-------------|
| `id` | uuid | No | `gen_random_uuid()` | Unique identifier for each post. |
| `client_name` | text | No | — | Selected client's name (Autocompleted). |
| `post_title` | text | Yes | — | Text/title of the post (Optional). |
| `socials` | text[] | Yes | — | Array of platforms selected (e.g. `{'Instagram', 'Facebook'}`). |
| `post_links` | jsonb | No | `'{}'::jsonb` | JSON object containing published post URLs mapped to their lowercase platform names. |
| `scheduled_date` | date | No | — | The date when the post is planned to go live. |
| `scheduled_time` | text | No | — | The time when the post is planned to go live (e.g. `"10:00 AM"`). |
| `posted_date` | date | Yes | — | The actual publish date. |
| `posted_time` | text | Yes | — | The actual publish time. |
| `status` | text | No | — | Current workflow stage: `'Not posted'`, `'Scheduled'`, or `'Posted'`. |
| `created_at` | timestamptz | No | `now()` | Timestamp of record creation. |
| `updated_at` | timestamptz | No | `now()` | Timestamp of the last edit. Automatically updated. |
