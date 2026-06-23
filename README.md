# Digi Carotene - Digital Marketting Agency

Service management app for **Digi Carotene**, a digital marketing agency.

![Dashboard](public/image.png)

**Staff Portal** (`/staff-portal`) — manage clients, projects, posts, team, analytics, and reports.
**Client Portal** (`/client-portal`) — read-only view of a brand’s posts and account.

**Domain:** `clients → projects → posts` (social URLs and team live on projects).

## Features (staff)

| Area | What |
|------|------|
| Dashboard | Workload, publishing chart, posts needing attention |
| Team | Staff roles, contact details, project history |
| Clients | Company registry |
| Projects | Social links, manager, team assignments |
| Posts | Month calendar — `Not posted`, `Scheduled`, `Posted` |
| Analytics & Reports | Agency and client activity |

Public marketing site (home, about, contact) plus auth at `/auth`.

## Getting started

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # production
```

**Supabase (SQL Editor):**

- New project → [`scripts/migrations/001_initial_schema.sql`](scripts/migrations/001_initial_schema.sql)
- Existing project → apply only missing files in [`scripts/migrations/`](scripts/migrations/) (see [`scripts/migrations/README.md`](scripts/migrations/README.md))

Schema and DTOs: [docs/README.md](docs/README.md) · [docs/database.md](docs/database.md)

## Tech stack

React · React Router v7 · Tailwind CSS · Shadcn UI · Recharts · Supabase (PostgreSQL, RLS) · Vite · Bun

## Project structure

```
src/
  app/         Router, App shell
  features/    staff-portal, client-portal, public, team-management, …
  shared/      UI, layouts, utils
docs/          Schema, RLS, per-feature docs
scripts/migrations/   Numbered SQL migrations
```

Agent conventions: [AGENTS.md](AGENTS.md)
