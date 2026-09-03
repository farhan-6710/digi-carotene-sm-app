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
| `admin` | team, clients, projects, posts, production plans, tasks, leads | All projects and plans |
| `manager` | clients, projects, posts, tasks, leads | Assigned projects / plans only |
| `executive` | posts, tasks, leads | Assigned projects / plans only |

**Assigned project** = SM: `sm_projects.manager_id` **or** active `project_team_members`; Dev: `dev_projects.manager_id` **or** active `dev_project_team_members`; Other: `other_projects.manager_id` **or** active `other_project_team_members`.  
**Assigned plan** = plan manager, shoot incharge, **or** active `production_plan_team_members`. Assigned people can add/edit **content** on that plan; creating/editing the plan record stays **admin**.

Content approvals on a plan item:

| Dropdown | Who can change it |
|----------|-------------------|
| Manager/Admin | `admin` or `manager` role |
| Client | `admin` or `manager` role on the team portal; the **linked client** on the client portal (their own plans only) |
| Shoot incharge | the plan’s `shoot_incharge_id` only |

---

## Team portal

| Area | Path | What |
|------|------|------|
| Dashboard | `/team-portal/dashboard` | Active-client stats, publishing chart, top clients, personal My To-dos, today’s posts, missed posts |
| Team | `/team-portal/team-management` | Roster; member detail = active projects + **active production plans** (assign / end) |
| Clients | `/team-portal/clients-management` | Brands, `is_active`; detail lists projects and plans |
| Projects Management | `/team-portal/projects-management` (SM) · `/team-portal/dev-projects-management` (dev) · `/team-portal/other-projects-management` (other) | Sidebar dropdown: Social Media, Development, Other Projects. All use optional `start_date` + `eta_date`. |
| Postings calendar | `/team-portal/posts-management` | Month grid; client/project filters in the URL; day page reuses them |
| Task Management | `/team-portal/tasks-management` | Project-scoped tasks; assign + dependencies; tabs All · Raised by me · Raised for me; detail + chat |
| Production planner | `/team-portal/production-planner` | Plans per client (`?client=` filter); detail = script, reference link, approvals |
| CRM | `/team-portal/crm` | Leads management; Contact (leads with score 5); lead detail notes, link attachments, open/closed activities (tasks, meetings, calls) |
| Notifications | `/team-portal/notifications` | Inbox + executive **approval queue** |
| Analytics | `/team-portal/analytics` | Agency activity |
| Growth | `/team-portal/growth-and-analytics` | Meta organic + ads; Manage Accounts (token) |
| Reports | `/team-portal/reports` | Growth reports |
| Account / Settings | `/team-portal/account`, `/settings` | Password, theme |

### Posts

Statuses: `Not posted` · `Scheduled` · `Posted`. Platforms on the **post**; profile URLs on the **project**. `post_links` jsonb holds live URLs after publish.

If an **executive** creates a post whose to-be-posted time is already past, it goes to `post_approval_requests` (not `posts`) until the project manager or an admin approves. Managers/admins insert backdated posts directly.

### Notifications

Unread inbox. Types: `approval` (linked to a request id), `post_digest` (midnight post cron), `task` (assigned, dependency, or project oversight on create), and `task_digest` (midnight high-priority task/subtask cron). Dismiss / review marks `read`.

Team dashboard **Needs Attention** lists open tasks/subtasks assigned to you or where you are a dependency (`task_tags`), sorted by priority.

### Tasks

Project-scoped only (SM **or** Dev project). Status: `pending` → `in_progress` → `completed`. Priority: `low` | `medium` | `high`. Required **ETA** (`eta_date` + `eta_time`) is the estimated deadline. Use the description to note blockers (no separate blocker flag).

**People on a task (keep roles separate):**

- **Assign to** — required; pick **one or more** project teammates and/or the project client (MultiSelect). Stored in `task_assignees` (teammate XOR client per row). Legacy `assigned_to_team_member_id` / `client_id` stay synced to the first of each kind for portal lists.
- **Dependencies** — optional project teammates (`task_tags`) and/or the project client (`tasks.dependency_client_id`). The assignee cannot also be listed as a dependency.

Visibility (team):

- **Admin** — all tasks
- **Project manager** (`sm_projects.manager_id` or `dev_projects.manager_id`) — all tasks on projects they manage
- **Everyone else** — raised by them, assigned to them, or listed as a dependency

Visibility (client): tasks where `client_id` matches (i.e. assigned to that client).

On create, notify the team assignee (if teammate), dependency members, project manager, and admins (excluding the raiser). Clients see the task in their portal list (no separate client inbox in V1).

Task detail includes DB-backed chat. Authors are a teammate **or** the task client. `@` mentions cover raiser, assignees, dependencies, project manager, task client, and admins. `/` mentions list this task’s subtasks by title. No websockets — refresh after send.

**Edit** — only the person who raised the task (team list pencil). Admins / PMs / assignees who did not raise it can still view and chat.

**Subtasks** — full-width block below chat on task detail (team + client). Anyone who can open the task can add a subtask (title + description + assign to someone already on that task). Click a subtask title to open its detail page (full description + meta). Subtask **full edit/delete** is only for that subtask’s raiser; the **assignee** can update status (`pending` → `in_progress` → `completed`).

---

## Client portal

The brand sees only their own data (`profiles.client_id`). No team CRUD, no Manage Accounts.

| Area | Path | What |
|------|------|------|
| Dashboard | `/client-portal/dashboard` | Post stats, projects/plans counts, upcoming posts, socials |
| Projects | `/client-portal/projects` | SM + Dev list; SM detail under `/projects/:id`, Dev under `/dev-projects/:id` (view-only) |
| Task Management | `/client-portal/tasks-management` | Tasks that include this client; detail + chat |
| Posts | `/client-portal/posts` | Read-only post list with search |
| Production planner | `/client-portal/production-planner` | Their plans; detail: **Client approval** dropdown only |
| Growth | `/client-portal/growth-and-analytics` | Same charts as team, scoped to linked accounts |
| Account | `/client-portal/account` | Brand details, password |

---

## Public

`/`, `/about`, `/auth`.

Share links (no sidebar, **view-only**): `/share/project/:token`, `/share/plan/:token`.

- **Who copies:** admin, or the manager on that project/plan (`manager_id`). Button is UI-only.
- **What is stored:** one UUID on `share_token`. Same link forever until you change the token (V1 does not rotate it).
- **Who opens:** anyone with the URL. No login. No buttons. Refresh to see updates.
- **Why two DB functions:** guests use the anon key; we cannot let them `select *` from projects/plans. The functions take the token and return that one page’s data.
