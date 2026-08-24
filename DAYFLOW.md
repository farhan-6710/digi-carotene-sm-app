# DayFlow — Product & Build Plan

> **Context for agents:** This file lives in the Digi Carotene repo root as the **master plan** for a **separate personal productivity app** called **DayFlow**. It is **not** a rebrand of Digi Carotene. Read this fully before scaffolding or copying code.

---

## Why this project exists

**Digi Carotene** (this repo) is a full agency operations platform — dual portal, clients, Meta analytics, production planner, team RBAC. It belongs on the resume under **work experience** (built solo for a real agency workflow).

**DayFlow** is a **new, separate personal project** with a honest story:

> “I wanted one daily app for my own tasks, project plans, reminders, and progress — not a team/agency tool. I reused patterns and UI from my agency work but cut scope to what I actually use every day.”

That gives two credible resume lines:

| Project | Resume section | Story |
|---|---|---|
| Digi Carotene | Work experience | Real agency ops platform, full stack, Meta integration |
| DayFlow | Personal projects | Daily productivity app I use myself |

No need to hide either. DayFlow should be **genuinely usable daily**, not a reskin.

---

## The plan (high level)

1. **New repo** — `dayflow-app` (recommended). Do not bolt DayFlow onto Digi Carotene routes.
2. **Same tech stack** as this project (see below).
3. **Copy/adapt patterns and UI shell** from Digi Carotene — not the agency domain.
4. **~40% of features** from this codebase is enough. Prefer deleting complexity over carrying it.
5. **Single-user V1** — one login, one portal. No client portal, no team roles, no Meta, no PHP crons.
6. Ship a **small vertical slice** first (auth → dashboard → tasks → calendar), then projects/plans, then analytics.

---

## What DayFlow is

**DayFlow** = personal command centre for:

- **Tasks** — things to do (with due date, reminder, priority, status)
- **Projects** — buckets of work (“Job search”, “Fitness”, “Side project”)
- **Plans** — milestones or grouped work **inside a project** (like posts inside a project in Digi Carotene)
- **Calendar** — month/week view of due tasks and reminders
- **Notes** — quick notes, optionally linked to a project
- **Analytics** — simple personal stats (completed this week, overdue, by project)
- **Account & Settings** — profile, password, theme

### Tasks vs Plans (keep simple)

Do **not** merge into one overloaded entity. Use two tables with a clear rule:

| Entity | Purpose | Example |
|---|---|---|
| **Plan** | A named group / milestone inside a project | “Week 1 — Setup”, “Phase 2 — Launch” |
| **Task** | One actionable item | “Buy domain”, “Call dentist” |

- A task **may** belong to a `project_id` and optionally a `plan_id`.
- Tasks **without** a project live in an **Inbox**.
- Reminders attach to **tasks** (due date + optional reminder time).

If V1 feels heavy, ship **tasks + projects** first; add **plans** in phase 2.

---

## What DayFlow is NOT (do not build in V1)

- Agency / client / team management
- Dual portal (team + client)
- Meta / Growth & Analytics / external API sync
- Production planner / shoot workflows
- Post calendar / social scheduling
- Task chat / @mentions / multi-assignee
- PHP crons / digest email (optional later)
- Complex RBAC (admin / manager / executive)
- Approval queues

---

## Tech stack (same as Digi Carotene)

| Layer | Choice |
|---|---|
| UI | React 19, React Router 7, Tailwind 4, shadcn/ui, Framer Motion, Recharts |
| Language | TypeScript |
| Build | Vite 8, Bun |
| Backend | Supabase (Postgres + Auth + RLS) |
| Deploy | Static `dist/` + Supabase (no Node API) |

**V1 env:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` only.

---

## Code principles (non-negotiable)

Same as [AGENTS.md](./AGENTS.md) / [DESIGN.md](./DESIGN.md), stricter on scope:

- **Least code, more output** — smallest change that works.
- **One function, one job** — no nested loops where a flat `map` + helper suffices; no clever abstractions.
- **Beginner-friendly** — a new dev should follow a feature folder top to bottom.
- **~120 lines per file** — split when larger.
- **No Supabase outside `src/services/`**.
- **Types/constants never inside `.tsx`**.
- **Presentational components** — logic in hooks/utils.
- **ConfirmationModal** before delete; **showToast** after mutations.
- **Simple SQL** — flat tables, one query per service function when possible.

---

## Domain model (V1)

```text
User (Supabase auth + profiles)
  └── Projects (optional grouping)
        └── Plans (optional grouping inside project)
              └── Tasks (action items; due_date, reminder_at, priority, status)
  └── Tasks (inbox — no project_id)
  └── Notes (optional project_id)
```

### Suggested tables

| Table | Core columns |
|---|---|
| `profiles` | `id`, `display_name`, `avatar_url`, theme prefs |
| `projects` | `id`, `user_id`, `name`, `color`, `is_archived`, timestamps |
| `plans` | `id`, `project_id`, `user_id`, `title`, `sort_order`, timestamps |
| `tasks` | `id`, `user_id`, `project_id?`, `plan_id?`, `title`, `description?`, `status`, `priority`, `due_date?`, `due_time?`, `reminder_at?`, timestamps |
| `notes` | `id`, `user_id`, `project_id?`, `title`, `body`, timestamps |

**Task status:** `todo` · `in_progress` · `done`  
**Task priority:** `low` · `medium` · `high`

**RLS:** every row scoped to `auth.uid() = user_id`. No shared workspaces in V1.

---

## App routes (V1)

| Route | Purpose |
|---|---|
| `/auth` | Sign in / sign up (email + Google) |
| `/dashboard` | Today’s tasks, overdue, quick stats, week snapshot |
| `/tasks` | All tasks — tabs: Inbox · Today · Upcoming · Done |
| `/projects` | Project list + create/edit |
| `/projects/:id` | Project detail — plans list + tasks for project |
| `/calendar` | Month grid — tasks by due date (reuse calendar patterns from posts-management) |
| `/notes` | Simple notes list + editor |
| `/analytics` | Personal charts — completed over time, by project, overdue count |
| `/account` | Profile, password |
| `/settings` | Theme, preferences |

Single layout shell — one sidebar, no team/client split.

---

## What to reuse from Digi Carotene

Copy or adapt from **this repo**. Strip agency naming and extra logic.

### Reuse as-is (or near-as-is)

| From Digi Carotene | DayFlow use |
|---|---|
| `src/shared/ui/*` | shadcn primitives |
| `src/shared/hooks/useFetch.ts` | Data loading |
| `src/shared/components/PageContent.tsx` | Page wrapper |
| `src/shared/components/PageHeader.tsx` | Page titles |
| `src/shared/components/ConfirmationModal.tsx` | Deletes |
| `src/shared/utils/showToast` | Feedback |
| `src/shared/constants/pageMotion.ts` | Route motion |
| `src/shared/components/TransitionLink.tsx` | Nav transitions |
| `src/services/supabaseClient.ts` | Supabase client |
| `src/services/db.ts` pattern | Table name map |
| `src/features/auth/*` | Auth pages — **remove** TeamRoute/ClientRoute; single `AppRoute` |
| `src/features/settings/*` | Theme / preferences |
| `src/app/` router patterns | Lazy routes, layout shell |

### Adapt (simplify heavily)

| From Digi Carotene | DayFlow use |
|---|---|
| `src/shared/components/ShellSidebar.tsx` | Single nav — fewer items |
| `src/features/tasks-management/` | Task list, dialog, detail — **drop** chat, client assignee, dependencies, project-manager visibility rules |
| `src/features/projects-management/` | Project CRUD — **drop** team assignments, social URLs, manager |
| `src/features/posts-management/` calendar | **Calendar view** for tasks by due date |
| `src/features/team-portal/` dashboard | Personal dashboard — KPI cards + “needs attention” → overdue tasks |
| `src/features/analytics/` | Simple Recharts — **drop** team/client breakdowns |

### Do not copy

| Feature | Reason |
|---|---|
| `client-portal-*`, `team-portal-shell` dual shell | Single user app |
| `clients-management` | No clients |
| `growth-and-analytics`, `metaService`, PHP scripts | No Meta |
| `production-planner` | Wrong domain |
| `post-approvals`, `notifications` (complex) | Overkill for V1 |
| `team-management`, RBAC utils | Single user |
| `share/`, public marketing site | Optional later |

---

## UI / UX direction

- **Keep the same visual language** as Digi Carotene (teal primary, clean cards, dark/light theme) — screenshots already prove you can ship polished UI.
- Rebrand: **DayFlow** logo, wordmark, sidebar subtitle “Personal workspace”.
- Dashboard layout mirrors agency dashboard: **stat cards** + **chart** + **right column “Needs attention”** (overdue / due today).
- Mobile-friendly later; desktop-first for V1.

---

## Build phases

### Phase 1 — Skeleton (ship something usable)

- [ ] New repo + Vite + Supabase + copy shared UI shell
- [ ] Auth (email + Google), `profiles`, RLS
- [ ] Layout: sidebar + header + dashboard placeholder
- [ ] **Tasks**: CRUD, inbox, status, priority, due date
- [ ] **Dashboard**: today’s tasks, overdue list, 3 stat cards

### Phase 2 — Structure

- [ ] **Projects**: CRUD, archive
- [ ] Link tasks to `project_id`
- [ ] **Calendar** page (month view, tasks on due dates)
- [ ] Task reminder fields (`reminder_at`) — browser notification optional later

### Phase 3 — Plans & notes

- [ ] **Plans** inside project detail
- [ ] Tasks optional `plan_id`
- [ ] **Notes** — list + simple markdown/plain body

### Phase 4 — Analytics & polish

- [ ] **Analytics** — tasks completed per day/week, by project (Recharts)
- [ ] Account + Settings pages
- [ ] Empty states, loading skeletons, lint + build clean

### Phase 5 — Nice-to-have (only if daily use needs it)

- [ ] Recurring tasks
- [ ] Email reminder (Supabase edge function — not PHP)
- [ ] PWA / install prompt
- [ ] Export data

---

## File structure (target)

```text
dayflow-app/
  src/
    app/              Router, App shell, AuthRoute
    services/         supabaseClient, db, tasksService, projectsService, …
    features/
      auth/
      dashboard/
      tasks/
      projects/
      calendar/
      notes/
      analytics/
      account/
      settings/
    shared/             ui/, components/, hooks/, utils/  (from Digi Carotene)
  scripts/migrations/   001_initial_schema.sql, …
  docs/                 README, database.md (short)
  AGENTS.md             Same rules as Digi Carotene, DayFlow-specific
  DESIGN.md             Layers diagram, domain model
```

---

## Agent instructions (when building DayFlow)

1. Read **this file** first, then DayFlow’s own `AGENTS.md` / `DESIGN.md`.
2. **Never** import from the Digi Carotene repo at runtime — copy files into DayFlow and rename.
3. When adapting a Digi Carotene feature, **delete** before adding — remove chat, RBAC, client fields, team fields.
4. Prefer **one migration per logical change**; never edit old migrations.
5. Every user-facing mutation → `showToast` + confirm on delete.
6. If a feature is not in the **App routes (V1)** table above, do not build it without explicit ask.
7. Optimize for **daily personal use**: fast task capture, clear today view, minimal clicks.

---

## Success criteria

DayFlow V1 is done when:

- [ ] You can sign in and use it **every day** for real tasks.
- [ ] Create project → add plan → add tasks → see them on calendar and dashboard.
- [ ] Analytics shows at least “completed this week” and “overdue”.
- [ ] Code passes `bun run lint` and `bun run build`.
- [ ] Resume one-liner: *“DayFlow — personal task & project planner (React, Supabase, TypeScript). Built for my own daily productivity.”*

---

## Assessment of this plan

**Sound approach.** Keeping Digi Carotene as work experience and building DayFlow separately avoids the “fake personal project” problem. Reusing ~40% of patterns from this repo is efficient; forcing a full rebrand of the agency app would waste Meta/RBAC work and still look wrong in demos.

Start **Phase 1** in a **new repo**. Use this file as the spec until DayFlow has its own `docs/` folder.
