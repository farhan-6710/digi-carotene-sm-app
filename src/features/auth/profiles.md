# Profiles — Supabase Setup

Link Supabase Auth users to app roles and (for clients) a row in `clients`.

## If login says “no profile” but Table Editor shows rows

The backfill script uses the **service role** (bypasses RLS). The app uses your **logged-in user** and needs a SELECT policy.

Run **`scripts/profiles-rls.sql`** in Supabase → SQL Editor, then log out and log in again.

Run in **Supabase → SQL Editor** after `clients` exists.

Minimal schema (matches app + scripts):

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'client', 'user')),
  client_id uuid references public.clients(id) on delete set null
);
```

Optional extras (`full_name`, `created_at`) are not used by the app unless you add them yourself.

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);
```

## Assign roles manually

**Admin** (after user signs up — copy UUID from Authentication → Users):

```sql
insert into public.profiles (id, role, client_id)
values ('<auth-user-uuid>', 'admin', null)
on conflict (id) do update set role = 'admin', client_id = null;
```

**Client portal user** (link to a client row):

```sql
insert into public.profiles (id, role, client_id)
values ('<auth-user-uuid>', 'client', '<clients-table-uuid>')
on conflict (id) do update
  set role = 'client', client_id = excluded.client_id;
```

## Auto profile on signup (role = client)

Run once: `scripts/on-signup-profile-trigger.sql` in SQL Editor.

## Backfill existing auth users as client

**Option A — Node (read `scripts/backfill-profiles.mjs` first):**

1. Add to `.env.local`:
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role secret, never commit)
2. Preview: `bun run backfill:profiles:dry-run`
3. Apply: `bun run backfill:profiles`

**Option B — SQL only:** run `scripts/backfill-profiles.sql` in SQL Editor.

Then promote admins manually:

```sql
update public.profiles set role = 'admin', client_id = null where id = '<your-uuid>';
```

Link portal users to a brand (`client_id` = uuid from **`public.clients`**, not the auth user id):

**Script (creates a client row if no name match):**

```bash
bun run link:profiles-clients:dry-run
bun run link:profiles-clients
```

**Or SQL** — `scripts/link-profiles-to-clients.sql`

Then run **`scripts/portal-data-rls.sql`** so portal users can read their brand and posts.

## Notes

- `user` role is treated like `admin` in the app (legacy default).
- Client users need `role = 'client'` and a non-null `client_id` for `/portal`.
- `profiles` holds roles; `clients` holds brands — do not confuse the two tables.
- Add stricter RLS on `posts` / `clients` when you harden production access.
