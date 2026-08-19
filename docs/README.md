# Digi Carotene — docs

Service-management app for **Digi Carotene**, a digital marketing agency.

The team runs clients, projects, scheduled posts, production shoots, and Meta (Facebook/Instagram) analytics in one portal. Each client can sign in to a read-only portal for their brand.

**Read this folder first** if you are new. Then `AGENTS.md` (how to change code) and `DESIGN.md` (layers).

| Doc | What it covers |
|-----|----------------|
| [This file](./README.md) | Purpose, stack, commands, architecture, practices |
| [database.md](./database.md) | Tables, relationships, migrations, RLS |
| [auth-and-features.md](./auth-and-features.md) | Auth, roles, portals, every feature |
| [ops.md](./ops.md) | Meta Business setup, PHP crons, Hostinger deploy |

---

## What this app is for

Digi Carotene plans and publishes social content for client brands, then reports on organic and ads performance.

- **Team portal** (`/team-portal`) — day-to-day work: roster, clients, projects, calendar, production plans, notifications, analytics.
- **Client portal** (`/client-portal`) — the brand sees their projects, posts, production plans (client approval), and Growth dashboards.
- **Public site** — home / about / contact plus `/auth`.
- **Pending users** (`/user-portal`) — signed up but not yet linked to a team member or client row.

Domain: **client (company) → project (social profiles + team) → posts**. Production plans hang off the **client**. Growth accounts also hang off the **client**.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 19, React Router 7, Tailwind 4, shadcn/ui, Framer Motion, Recharts |
| Language | TypeScript |
| Build | Vite 8, Bun |
| Backend | Supabase (Postgres + Auth + RLS). No custom Node API. |
| Crons / email | PHP 8.2 on Hostinger (`scripts/php/`), Resend for digest mail |
| Meta | Graph API via a **System User** long-lived token |

There is **no `.env` in the repo**. Local Vite still needs two values at **build/dev time** (they are compiled into the JS; production does not read a server env file):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (anon / publishable key)

Put them in a local `.env` that you do not commit, or export them in the shell before `bun run dev` / `bun run build`. PHP secrets live in `public_html/php/config.php` (copied from `scripts/php/config.example.php`), not in env vars.

---

## Commands

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # writes static files to dist/
bun run lint
bun run preview  # serve dist locally
```

Package manager is **Bun**. Use `bun`, not npm.

---

## Architecture

Data flows one way. Each layer has one job.

```
page → hook → service → Supabase
         └ presentational component
```

| Layer | Where | Job |
|-------|--------|-----|
| Pages | `src/features/*/pages` | Compose hooks + components. No business logic. |
| Components | `src/features/*/components` | Props in, UI out. |
| Hooks | `src/features/*/hooks` | One concern each (fetch, dialog, filters). |
| Services | `src/services/` | **Only** place that imports `supabase`. |
| Utils | `features/*/utils`, `shared/utils` | Pure helpers. No Supabase. |
| Shared UI | `src/shared/ui/` | shadcn primitives. |

Query hooks use `useFetch(load, fallback)` (`src/shared/hooks/useFetch.ts`). Services: query → run → throw on error → map to a domain type. Table names live in `src/services/db.ts` (`DB.POSTS.TABLE`, `DB.POSTS.SELECT`).

```
src/
  app/          Router, lazy pages
  services/     Supabase + Meta calls
  features/     One folder per product area
  shared/       Cross-feature UI, hooks, layouts
scripts/
  migrations/   Numbered SQL
  php/          Crons (deploy as public_html/php/)
```

---

## Design principles (V1)

- **Least code, more output.** Smallest change that solves the problem.
- **One function, one job.** Readable paths over clever abstractions.
- **DRY when something is used twice**, not preemptively.
- **Handle V1 edge cases** without extra frameworks.
- Domain types in `types/types.ts`, props in `types/components.ts`, constants in `constants/`. Nothing of that in `.tsx`.
- Target ~120 lines per file; split when larger. Named exports.
- Toasts: `showToast("success" \| "error" \| "info", message)` after mutations.
- Destructive actions go through `ConfirmationModal`.
- Frontend RBAC: `src/shared/utils/rbac.ts` from `team_members.team_role`. Do not sprinkle `role === "admin"`.
- Schema change → **new** `scripts/migrations/00N_*.sql`. Never edit old migrations.

Full change rules: [AGENTS.md](../AGENTS.md). Layers: [DESIGN.md](../DESIGN.md).
