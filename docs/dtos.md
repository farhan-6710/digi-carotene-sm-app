# Posts Management — Supabase Setup (minimal)

Everything you need **right now** for calendar CRUD + date selector month loading.

Skip profiles, reports, dashboard tables — add those later.

---

## What the app does

1. User picks a date (e.g. **May 29, 2026**) in `DateSelector`
2. App loads **all entries for May 2026** from Supabase
3. Table shows one cell per day; each cell can have multiple rows
4. User can **add**, **edit**, or **delete** a row (client name + times + status)

Each row on the calendar = one record in the database.

---

## One table is enough: `posts`

| Column | Type | Required | Example |
|--------|------|----------|-----------|
| `id` | uuid | yes | auto-generated |
| `client_name` | text | yes | `"Bloom Skincare"` |
| `scheduled_date` | date | yes | `2026-05-29` |
| `scheduled_time` | text | yes | `"10:00 AM"` |
| `posted_date` | date | no | `2026-05-30` |
| `posted_time` | text | no | `"2:00 PM"` |
| `status` | text | yes | `Not posted`, `Scheduled`, or `Posted` |
| `created_at` | timestamptz | yes | auto |

### Field meaning

| UI label | DB columns | Notes |
|----------|------------|-------|
| **To be posted on** | `scheduled_date` + `scheduled_time` | Planned publish date/time |
| **Posted on** | `posted_date` + `posted_time` | Actual publish date/time; nullable until posted |
| **Status** | `status` | See below |

### Status values

| Status | Meaning |
|--------|---------|
| `Not posted` | Not live yet; no platform auto-schedule |
| `Scheduled` | Scheduled on Instagram/Facebook to publish automatically at **To be posted on** |
| `Posted` | Already published (set **Posted on** when known) |

Calendar placement for delayed posts is still TBD in the UI — data model supports both planned and actual times.

---

## SQL — run in Supabase → SQL Editor

### Fresh install

```sql
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  scheduled_date date not null,
  scheduled_time text not null,
  posted_date date,
  posted_time text,
  status text not null check (status in ('Not posted', 'Scheduled', 'Posted')),
  created_at timestamptz not null default now()
);

create index posts_scheduled_date_idx on public.posts (scheduled_date);

alter table public.posts enable row level security;

create policy "Logged-in users can read posts"
  on public.posts for select
  to authenticated
  using (true);

create policy "Logged-in users can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

create policy "Logged-in users can update posts"
  on public.posts for update
  to authenticated
  using (true);

create policy "Logged-in users can delete posts"
  on public.posts for delete
  to authenticated
  using (true);
```

### Migrate existing `posts` table

Run this if you already created the old schema (`Draft`, `Missed`, no `posted_*` columns):

```sql
alter table public.posts
  add column if not exists posted_date date,
  add column if not exists posted_time text,
  add column if not exists post_title text,
  add column if not exists socials text[];

update public.posts
set status = 'Not posted'
where status in ('Draft', 'Missed');

update public.posts
set status = 'Scheduled'
where status = 'scheduled';

update public.posts
set status = 'Posted'
where status = 'posted';

alter table public.posts drop constraint if exists posts_status_check;

alter table public.posts
  add constraint posts_status_check
  check (status in ('Not posted', 'Scheduled', 'Posted'));
```

---

## How month loading works

When `selectedDate` = May 29, 2026:

```
start = 2026-05-01
end   = 2026-05-31
```

**Supabase query:**

```ts
const start = new Date(year, month - 1, 1);
const end = new Date(year, month, 0);

await supabase
  .from("posts")
  .select("*")
  .gte("scheduled_date", format(start, "yyyy-MM-dd"))
  .lte("scheduled_date", format(end, "yyyy-MM-dd"))
  .order("scheduled_date")
  .order("scheduled_time");
```

Frontend groups results by `scheduled_date` to fill each calendar cell.

When user selects **June**, change the month → run the same query for June → table re-renders.

---

## CRUD operations

| Action | UI | Supabase |
|--------|-----|----------|
| **Add** | Click day → dialog → Save | `insert` into `posts` |
| **Edit** | Click row → dialog → Save | `update` by `id` |
| **Delete** | Edit dialog → Remove | `delete` by `id` |
| **Load month** | Date selector / month change | `select` where date in month |

**Insert example:**

```ts
await supabase.from("posts").insert({
  client_name: "Bloom Skincare",
  scheduled_date: "2026-05-29",
  scheduled_time: "10:00 AM",
  posted_date: null,
  posted_time: null,
  status: "Scheduled",
});
```

**Update example:**

```ts
await supabase.from("posts").update({
  client_name,
  scheduled_date,
  scheduled_time,
  posted_date,
  posted_time,
  status,
}).eq("id", postId);
```

**Delete example:**

```ts
await supabase.from("posts").delete().eq("id", postId);
```

---

## App type

```ts
type StatusKey = "Not posted" | "Scheduled" | "Posted";

type Post = {
  id: string;
  client_name: string;
  scheduled_date: string;
  scheduled_time: string;
  posted_date: string | null;
  posted_time: string | null;
  status: StatusKey;
  created_at: string;
};
```

---

## Checklist summary

| Need | Solution |
|------|----------|
| Planned publish time | `scheduled_date` + `scheduled_time` |
| Actual publish time | `posted_date` + `posted_time` (nullable) |
| Status workflow | `Not posted` / `Scheduled` / `Posted` |
| Load May when May is selected | Query by `scheduled_date` month range |
| Add / edit / delete | insert / update / delete on `posts` |
| Auth | Already done — use `authenticated` RLS |
