# Auth, roles, and features

Code: `src/features/auth/`. Profile table + signup trigger: `scripts/migrations/001_initial_schema.sql` (plus `011` / `015` if an older DB is missing auto-link).

---

## How login works

Supabase Auth. No custom session server.

1. Sign up / sign in at `/auth` — **email + password** or **Google**.
2. Trigger creates `profiles` (`role = user`).
3. `link_profile_by_email` (DB trigger, plus app RPC fallback) matches the email to `team_members` or `clients`.
4. User **refreshes** (or “Refresh access” on `/user-portal`) → `TeamRoute` / `ClientRoute` / `UserRoute` send them to the right portal.

| `profiles.role` | Needs | Lands on |
|-----------------|-------|----------|
| `user` | — | `/user-portal` (pending) |
| `team` | `team_member_id` | `/team-portal` |
| `client` | `client_id` | `/client-portal` |

**V1:** email confirm is off in Supabase. Facebook login button is a **placeholder** (do not wire it to a Business Meta app). Portal Google login is a **Consumer** OAuth app, **separate** from the Growth System User app.

Passwords live only in `auth.users`. Account page can set / change / remove password (remove only if another identity remains, e.g. Google). Forgot password uses Supabase reset email; allow-list `/auth?form-type=reset-password`.

Deleting a team member resets linked profiles to `role = user`.

---

## Team roles (RBAC)

`team_members.team_role` drives the UI (`src/shared/utils/rbac.ts`). Postgres RLS does **not** encode these roles.

| Role | Full CRUD on | List scope |
|------|----------------|------------|
| `admin` | team, clients, projects, posts, production plans | All projects and plans |
| `manager` | clients, projects, posts | Assigned projects / plans only |
| `executive` | posts | Assigned projects / plans only |

**Assigned project** = `projects.manager_id` **or** active `project_team_members`.  
**Assigned plan** = plan manager, shoot incharge, **or** active `production_plan_team_members`. Assigned people can add/edit **content** on that plan; creating/editing the plan record stays **admin**.

Content approvals on a plan item:

| Dropdown | Who can change it |
|----------|-------------------|
| Manager/Admin | `admin` or `manager` role |
| Client | `admin` or `manager` role |
| Shoot incharge | the plan’s `shoot_incharge_id` only |

---

## Team portal

| Area | Path | What |
|------|------|------|
| Dashboard | `/team-portal/dashboard` | Active-client stats, publishing chart, today’s posts, missed posts |
| Team | `/team-portal/team-management` | Roster; member detail = active projects + **active production plans** (assign / end) |
| Clients | `/team-portal/clients-management` | Brands, `is_active`; detail lists projects and plans |
| Projects | `/team-portal/projects-management` | Social URLs, manager, extra team; `is_active` |
| Postings calendar | `/team-portal/posts-management` | Month grid; client/project filters in the URL; day page reuses them |
| Production planner | `/team-portal/production-planner` | Plans per client (`?client=` filter); detail = script, reference link, approvals |
| Notifications | `/team-portal/notifications` | Inbox + executive **approval queue** |
| Analytics | `/team-portal/analytics` | Agency activity |
| Growth | `/team-portal/growth-and-analytics` | Meta organic + ads; Manage Accounts (token) |
| Reports | `/team-portal/reports` | Growth reports |
| Account / Settings | `/team-portal/account`, `/settings` | Password, theme |

### Posts

Statuses: `Not posted` · `Scheduled` · `Posted`. Platforms on the **post**; profile URLs on the **project**. `post_links` jsonb holds live URLs after publish.

If an **executive** creates a post whose to-be-posted time is already past, it goes to `post_approval_requests` (not `posts`) until the project manager or an admin approves. Managers/admins insert backdated posts directly.

### Notifications

Unread inbox. Types: `approval` (linked to a request id) and `post_digest` (inserted by the midnight cron when email is sent). Dismiss / review marks `read`.

---

## Client portal

Same Growth charts and a posts view, scoped to `profiles.client_id`. No Manage Accounts, no team CRUD.

---

## Public

`/`, `/about`, `/contact`, `/auth`.
