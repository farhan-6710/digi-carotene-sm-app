# Agent guidelines — Digi Carotene

Service management app for the Digi Carotene digital marketing agency (team portal + client portal). Follow these conventions when adding or changing code in this repo.

## Top-level layout

```
src/
  app/              Router, App shell
  services/         API layer: Supabase client + all data calls
  features/         Feature modules (team-portal, client-portal, public)
  shared/           Cross-feature UI, layouts, utils
```

Each feature lives under `src/features/<feature-name>/`.

## Feature module structure

```
features/<feature-name>/
  components/       React UI for this feature
  constants/        Static data, enums, config, layout constants
  hooks/            Feature hooks
  pages/            Route-level page components
  providers/        React context providers (when needed)
  types/
    types.ts        Domain & API types
    components.ts   Component prop types
  utils/            Pure helpers, repositories
```

**Rules**

- Do **not** define domain types or static constants inside component files.
- Put **prop types** in `types/components.ts` (same feature).
- Put **domain/data types** in `types/types.ts`.
- Put **mock data, labels, maps, magic numbers** in `constants/`.
- Components should mostly import types/constants and render UI.
- Keep components **presentational, modular, and as logic-free as possible**.
- Move **business logic** to custom hooks, utilities, and repositories — not JSX files.
- Prefer **reusable components and shared patterns** over duplicated code.

## File size & responsibilities

- Target **~120 lines max** per component, hook, or page file. Go slightly over only when splitting would hurt clarity.
- **Pages** compose hooks + child components; avoid business logic in pages.
- **Hooks**: one concern per hook. Example split:
  - `useClientsQuery` / `useTeamMembersQuery` — fetch/list state
  - `useClientDialog` / `useTeamMemberDialog` — dialog form + mutations
  - `useClientsManagement` / `useTeamManagement` — thin composer that wires the above
  - `useAnalyticsTab` — URL-synced tab state; panel components stay presentational
- **Utils** hold pure transforms, validation, and form mappers (e.g. `clientFormUtils.ts`, `postsAnalyticsUtils.ts`). Utils must **not** call Supabase — data calls live in `src/services/`.
- When a dialog has many fields, pass a **`values` object + `onFieldChange` / `patchValues`** instead of one prop per field.
- Extract child components when JSX blocks repeat or a file grows past the limit.
- Destructive actions in dialogs use nested **`ConfirmationModal`** (see `ClientDialog`, `TeamMemberDialog`).

Shared account UI types live in `src/shared/components/account/types.ts`. Shared prop types used across features go in `src/shared/types/components.ts`.

## UI & UX standards

- Use **shadcn UI** components from `src/shared/ui/` for consistency.
- Use **`PageHeader`** (`src/shared/components/PageHeader.tsx`) for team portal page titles, descriptions, back buttons (left-aligned), and right-side actions. Avoid thin wrapper components around `PageHeader`.
- Use **`ConfirmationModal`** for all confirmation flows (delete, end assignment, sign-out, etc.).
- Use **Sonner** for notifications via **`showToast(type, message)`** in `src/shared/utils/showToast.ts` (`success` | `error` | `info` with Lucide icons).
- Show toasts for important actions: create, update, delete, API success/failure across team members, clients, posts, etc.
- Maintain **consistent spacing, sizing, typography, and component behavior** across the app.
- Tabbed views (e.g. Analytics) sync active tab to **URL query params**; use a dedicated hook + constants for parse/serialize.

## Naming

### Pages (route components)

| Area   | Pattern              | Example                    |
|--------|----------------------|----------------------------|
| Team  | `Team*Page` or `*ManagementPage` | `TeamDashboardPage`, `ClientsManagementPage`, `TeamManagementPage` |
| Client | `Client*Page`        | `ClientDashboardPage`      |
| Public | descriptive name     | `HomePage`, `AboutPage`    |

File name must match the exported component: `TeamDashboardPage.tsx` exports `TeamDashboardPage`.

### Components

- **PascalCase** file and export names: `PostsManagementWeeksTable.tsx` → `PostsManagementWeeksTable`.
- Prefer **named exports** over default exports.
- Prefix client-portal-only components with `Client` when they mirror team patterns (e.g. `ClientPostsTable`, `ClientSocialLinks`).

### Constants & types

- Constants: **SCREAMING_SNAKE** for primitives (`ANALYTICS_TAB_PARAM`), camelCase for objects/arrays (`dashboardQuickLinks`).
- Types/interfaces: **PascalCase** (`PostDialogProps`, `PostsStatCard`).
- Props types suffix: `*Props`.

## Team portal vs client portal

- Team routes: `/team-portal/*` — shell in `team-portal-shell`, layout `TeamLayout`.
- Client routes: `/client-portal/*` — shell in `client-portal-shell`, layout `ClientLayout`.
- Keep naming symmetric between the two (`TeamDashboardPage` / `ClientDashboardPage`, `TeamLayout` / `ClientLayout`).

## Services (API layer)

All Supabase access lives in `src/services/` — keep it simple and beginner-friendly.

- `supabaseClient.ts` — the single Supabase client (base connection).
- `db.ts` — the `DB` constants map: every table name + its select string (`DB.POSTS.TABLE`, `DB.POSTS.SELECT`). Add new tables here, not inline.
- One service file per domain (`postsService.ts`, `clientsService.ts`, `teamMembersService.ts`, `projectsService.ts`, `projectTeamMembersService.ts`, `postApprovalsService.ts`, `reportsService.ts`, `dashboardService.ts`, `authService.ts`, `profilesService.ts`).
- A service function does **one** job: build the query, run it, throw on error, map the row to a domain type. No caching, no dedupe, no realtime — keep it plain async/await.
- Services map camelCase TS fields to snake_case DB columns.
- Hooks/providers/components import from `@/services/*`; they never call `supabase` directly.

## Supabase & migrations

- **Setup:** new projects run `scripts/migrations/001_initial_schema.sql`; existing DBs run only unapplied files from `scripts/migrations/` (see README there). Never edit old migrations — add a new numbered file.
- **Docs:** all schema, RLS, and DTOs live under `docs/` — start at [docs/README.md](./docs/README.md).
  - `docs/database.md` — reset, setup, domain model
  - `docs/team-portal/<feature>/` — per-feature tables, DTOs, UI flows
- **Domain:** `clients` (company) → `projects` (socials, manager, team) → `posts` (`project_id`).
- **Project team:** required `projects.manager_id`; extra members in `project_team_members` with `started_at` / `ended_at` (active when `ended_at IS NULL`).
- Keep **backend V1 simple**. Avoid unnecessary abstractions and complex SQL.

## Imports

- Use `@/` path alias (e.g. `@/features/team-dashboard/pages/TeamDashboardPage`).
- Import types with `import type { ... }`.
- shadcn UI components live in `src/shared/ui/`; configure `components.json` with `src/shared/...` paths (not literal `@/` folders).

## What not to do

- No types/constants buried in `.tsx` files (except short-lived locals inside a function).
- No default-export page components when a named export is used elsewhere.
- No `supabase` calls outside `src/services/`; no new folders like `models/`, `interfaces/`.
- No drive-by refactors or extra abstractions beyond the task scope.
- No one-line wrapper components that only forward props to a shared component.

## Checklist before finishing

1. Page/component names match file names and area prefix rules.
2. New types are in `types/`, new constants in `constants/`.
3. Router, sidebar nav, and imports updated for new routes.
4. New schema change → add `scripts/migrations/00N_<description>.sql` (see `docs/database.md`); do not edit prior migration files.
5. Important mutations show `showToast` feedback where appropriate.
6. `bun run build` passes.
