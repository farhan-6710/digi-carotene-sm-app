# Design — Digi Carotene

How the app is built. Product + onboarding: [docs-2026-08-22/README.md](docs-2026-08-22/README.md). Change rules: [AGENTS.md](AGENTS.md).

## Layers

Data flows in one direction. Each layer has one job.

```
page → hook → service → Supabase
  └ component (presentational)
```

- **Pages** (`features/*/pages`) — compose hooks + components. No business logic.
- **Components** (`features/*/components`) — presentational. Props in, UI out.
- **Hooks** (`features/*/hooks`) — state, effects, and actions for one concern.
- **Services** (`src/services`) — every Supabase call. The only place that imports the client.
- **Utils** (`features/*/utils`) — pure transforms, validation, formatters. No Supabase.

## Services (API layer)

All data access lives in `src/services/`. Keep functions plain async/await — no caching, dedupe, or realtime.

- `supabaseClient.ts` — the single Supabase client.
- `db.ts` — `DB` map of table names + select strings: `DB.POSTS.TABLE`, `DB.POSTS.SELECT`.
- One file per domain.

A service function does one job: build the query → run it → throw on error → map the row to a domain type.

## Data loading

Query hooks use `useFetch(load, fallback)` (`src/shared/hooks/useFetch.ts`). Wrap `load` in `useCallback`.

## Auth & access

- `AuthProvider` loads the session once, then reacts to sign in / sign out.
- Profile linking is **database triggers** (`link_profile_by_email`) plus an RPC fallback after saving a team member or client.
- A pending user refreshes to pick up access.
- Route guards (`TeamRoute`, `ClientRoute`, `UserRoute`) redirect by `profiles.role`. Details: [docs-2026-08-22/auth-and-features.md](docs-2026-08-22/auth-and-features.md).

## Domain

`clients` → `projects` → `posts`. Extra project team: `project_team_members` (`ended_at IS NULL`). Production plans hang off **clients**. Schema: [docs-2026-08-22/database.md](docs-2026-08-22/database.md).

## Conventions (summary)

- Domain types in `types/types.ts`; prop types in `types/components.ts`; constants in `constants/`.
- shadcn from `src/shared/ui/`. Toasts via `showToast(type, message)`.
- `@/` import alias. `import type` for types.
- Target ~120 lines per file; split when larger.
