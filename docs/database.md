# Database

Postgres on **Supabase**. Schema lives in numbered SQL files under [`scripts/migrations/`](../scripts/migrations/). Run them in the **Supabase SQL Editor**. Guide: [`scripts/migrations/README.md`](../scripts/migrations/README.md).

- **New project:** run only `001_initial_schema.sql`.
- **Existing project:** run only files you have not applied yet, in order (`002` → current).
- **Never edit** an old migration. Add `038_…sql` (next number) instead.

---

## Domain

```
auth.users ──1:1── profiles
profiles.client_id ──► clients          (client portal)
profiles.team_member_id ──► team_members (team portal)

clients
  ├── projects
  │     ├── manager_id ──► team_members
  │     ├── project_team_members ──► team_members   (active when ended_at IS NULL)
  │     └── posts
  ├── production_plans
  │     ├── manager_id / shoot_incharge_id ──► team_members
  │     ├── production_plan_team_members ──► team_members
  │     └── production_plan_items
  ├── growth_organic_accounts
  └── growth_ads_accounts
```

Rules: a **client** is a company. A **project** is one engagement (social profile URLs + manager). A **post** belongs to a project. Same brand, different social accounts → another project. No project, no post.

---

## Tables (short)

| Table | Purpose |
|-------|---------|
| `profiles` | Auth user → portal (`role`: `team` / `client` / `user`) + `client_id` / `team_member_id` |
| `clients` | Brand registry (`is_active`) |
| `team_members` | Internal roster (`team_role`: `admin` / `manager` / `executive`) |
| `projects` | Client work + `socials` jsonb + `manager_id` + `is_active` + `share_token` |
| `project_team_members` | Extra people on a project; `ended_at` null = active |
| `posts` | Calendar row (`to_be_posted_*`, `status`, `socials[]`, `post_links`) |
| `post_approval_requests` | Executive backdated posts waiting on manager/admin |
| `notifications` | Team inbox (`approval`, `post_digest`) |
| `production_plans` | Shoot plan per client + `share_token` |
| `production_plan_items` | Content in a plan: `script`, `reference_link`, three approvals |
| `production_plan_team_members` | Extra people on a plan |
| `growth_organic_*` | Connected IG/Page + post metrics + daily followers |
| `growth_ads_*` | Connected ad accounts + campaign / ad set / ad daily metrics |

Types for the UI live in `src/features/<feature>/types/types.ts` — not duplicated here.

---

## RLS (V1)

Authenticated **team** users: full CRUD on operational tables. **Client** portal: SELECT own `clients` row and posts under that client’s projects. Growth tables use authenticated access; the UI scopes by `client_id`. PHP crons use the **service_role** key (bypasses RLS).

Public share links (`/share/project/:token`, `/share/plan/:token`) load one record via `fetch_shared_project` / `fetch_shared_production_plan` (security definer, granted to `anon`). Matching client email can update Client approval on a shared plan via `update_shared_plan_item_client_approval`.

---

## First-time data

1. Sign up at `/auth?form-type=signup` → `profiles.role = user` → `/user-portal`.
2. Add that email as a **team member** (or **client**) → profile auto-links → refresh.
3. Clients → at least one **manager** team member → Projects → Posts.
4. Production plans and Growth accounts attach to a client.

Suggested setup order: **Clients → Team → Projects → Posts**.
