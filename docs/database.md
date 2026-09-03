# Database

Postgres on **Supabase**. Schema lives in numbered SQL files under [`scripts/migrations/`](../scripts/migrations/). Run them in the **Supabase SQL Editor**. Guide: [`scripts/migrations/README.md`](../scripts/migrations/README.md).

- **New project:** run only `001_initial_schema.sql`.
- **Existing project:** run only files you have not applied yet, in order (`002` → current).
- **Never edit** an old migration. Add `042_…sql` (next number) instead.

### Must follow — V1 SQL

SQL queries as simple as possible. No massive DB operations. Beginner-friendly V1: flat tables + simple filters; avoid RPCs, heavy triggers, and audit chains unless there is no simpler way.

---

## Domain

```
auth.users ──1:1── profiles
profiles.client_id ──► clients          (client portal)
profiles.team_member_id ──► team_members (team portal)

clients
  ├── sm_projects
  │     ├── manager_id ──► team_members
  │     ├── project_team_members ──► team_members   (active when ended_at IS NULL)
  │     ├── posts
  │     └── tasks (project_id) ──► …               XOR with dev_projects
  ├── dev_projects
  │     ├── manager_id ──► team_members
  │     ├── dev_project_team_members ──► team_members
  │     └── tasks (dev_project_id) ──► …           XOR with sm_projects
  ├── other_projects
  │     ├── manager_id ──► team_members
  │     └── other_project_team_members ──► team_members
  ├── production_plans
  │     ├── manager_id / shoot_incharge_id ──► team_members
  │     ├── production_plan_team_members ──► team_members
  │     └── production_plan_items
  ├── growth_organic_accounts
  └── growth_ads_accounts

leads   (flat CRM table — not tied to a client in V1)
  ├── lead_notes
  ├── lead_attachments   (URL links)
  ├── lead_tasks
  ├── lead_meetings
  └── lead_calls
```

Rules: a **client** is a company. An **SM project** (`sm_projects`) is one social engagement (profile URLs + manager). A **dev project** (`dev_projects`) is a separate development engagement. An **other project** (`other_projects`) is any other client engagement (start / ETA, no tech URLs). A **post** belongs to an SM project. A **task** belongs to either an SM project or a Dev project (not both). Same brand, different social accounts → another SM project. No SM project, no post.

---

## Tables (short)

| Table | Purpose |
|-------|---------|
| `profiles` | Auth user → portal (`role`: `team` / `client` / `user`) + `client_id` / `team_member_id` |
| `clients` | Brand registry (`is_active`, primary/secondary contact name + mobile) |
| `team_members` | Internal roster (`team_role`: `admin` / `manager` / `executive`) |
| `sm_projects` | Social media work + `socials` jsonb + `manager_id` + `start_date` / `eta_date` + `is_active` + `share_token` |
| `dev_projects` | Development work: description, repo/staging/prod URLs, `start_date` / `eta_date`, `is_active` |
| `other_projects` | Other client work: description, `start_date` / `eta_date`, `is_active` (no tech/URL fields) |
| `project_team_members` | Extra people on an SM project; `ended_at` null = active. All `admin` team members are auto-assigned on create/update. |
| `dev_project_team_members` | Extra people on a development project; `ended_at` null = active. All `admin` team members are auto-assigned on create/update. |
| `other_project_team_members` | Extra people on an other project; `ended_at` null = active. All `admin` team members are auto-assigned on create/update. |
| `posts` | Calendar row (`to_be_posted_*`, `status`, `socials[]`, `post_links`) |
| `post_approval_requests` | Executive backdated posts waiting on manager/admin |
| `notifications` | Team inbox (`approval`, `post_digest`, `task`, `task_digest`) |
| `tasks` | Task on **one** of SM (`project_id`) or Dev (`dev_project_id`); raiser, multi-assignees, priority, ETA, status |
| `task_tags` | Task dependencies for extra teammates (`team_member_id`) |
| `task_assignees` | Task assignees: teammate **or** client per row |
| `task_messages` | Task chat; author is teammate **or** client (`author_team_member_id` / `author_client_id`) |
| `subtasks` | Nested under a task; title + description; creator XOR; multi-assignees via `subtask_assignees` |
| `subtask_assignees` | Subtask assignees: teammate **or** client per row |
| `leads` | CRM leads: name, company, email, phone, industry, lead score (1–5), status, lead source, tags (`text[]`), address |
| `lead_notes` | Free-text notes on a lead |
| `lead_attachments` | URL links stored on a lead (optional label) |
| `lead_tasks` | Lead follow-up task: title, description, priority, status, ETA date + time |
| `lead_meetings` | Lead meeting: from/to date+time, venue (`client_location` / `in_office` / `online`), status |
| `lead_calls` | Lead call: start date+time, duration minutes, status |
| `team_todos` | Personal dashboard to-dos per team member: title, description, ETA date+time, status |
| `production_plans` | Shoot plan per client + `share_token` |
| `production_plan_items` | Content in a plan: `script`, `reference_link`, three approvals |
| `production_plan_team_members` | Extra people on a plan. All `admin` team members are auto-assigned on create/update (unless they are already manager or shoot incharge). |
| `growth_organic_*` | Connected IG/Page + post metrics + daily followers |
| `growth_ads_*` | Connected ad accounts + campaign / ad set / ad daily metrics |

Types for the UI live in `src/features/<feature>/types/types.ts` — not duplicated here.

---

## RLS (V1)

Authenticated **team** users: full CRUD on operational tables. **Client** portal: SELECT own `clients` row and posts under that client’s projects. Growth tables use authenticated access; the UI scopes by `client_id`. PHP crons use the **service_role** key (bypasses RLS).

Public share links:

1. Team user copies a link → app writes a UUID into `sm_projects.share_token` or `production_plans.share_token` (once).
2. Guest opens `/share/project/:token` or `/share/plan/:token` with **no login**.
3. The page calls `fetch_shared_project` / `fetch_shared_production_plan` (those two functions exist so guests can read **one** shared record without opening the whole table). View-only. Refresh to see new data.

Client approval is edited in the **client portal**, not on the share URL.

---

## First-time data

1. Sign up at `/auth?form-type=signup` → `profiles.role = user` → `/user-portal`.
2. Add that email as a **team member** (or **client**) → profile auto-links → refresh.
3. Clients → at least one **manager** team member → Projects → Posts.
4. Production plans and Growth accounts attach to a client.

Suggested setup order: **Clients → Team → Projects → Posts**.
