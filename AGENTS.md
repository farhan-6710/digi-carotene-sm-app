# Agent guidelines — Digi Carotene

Follow these conventions when adding or changing code in this repo. Keep structure simple; do not introduce extra layers unless they solve a real problem.

## Top-level layout

```
src/
  app/              Router, App shell
  features/         Feature modules (admin, portal, public)
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
  - `useClientsQuery` / `useEmployeesQuery` — fetch/list state
  - `useClientDialog` / `useEmployeeDialog` — dialog form + mutations
  - `useClientsManagement` / `useEmployeesManagement` — thin composer that wires the above
  - `useAnalyticsTab` — URL-synced tab state; panel components stay presentational
- **Utils** hold pure transforms, validation, and form mappers (e.g. `clientFormUtils.ts`, `postsAnalyticsUtils.ts`).
- When a dialog has many fields, pass a **`values` object + `onFieldChange` / `patchValues`** instead of one prop per field.
- Extract child components when JSX blocks repeat or a file grows past the limit.
- Destructive actions in dialogs use nested **`ConfirmationModal`** (see `ClientDialog`, `EmployeeDialog`).

Shared account UI types live in `src/shared/components/account/types.ts`. Shared prop types used across features go in `src/shared/types/components.ts`.

## UI & UX standards

- Use **shadcn UI** components from `src/shared/ui/` for consistency.
- Use **`PageHeader`** (`src/shared/components/PageHeader.tsx`) for admin page titles, descriptions, back buttons (left-aligned), and right-side actions. Avoid thin wrapper components around `PageHeader`.
- Use **`ConfirmationModal`** for all confirmation flows (delete, end assignment, sign-out, etc.).
- Use **Sonner** for notifications via **`showToast(type, message)`** in `src/shared/utils/showToast.ts` (`success` | `error` | `info` with Lucide icons).
- Show toasts for important actions: create, update, delete, API success/failure across employees, clients, posts, etc.
- Maintain **consistent spacing, sizing, typography, and component behavior** across the app.
- Tabbed views (e.g. Analytics) sync active tab to **URL query params**; use a dedicated hook + constants for parse/serialize.

## Naming

### Pages (route components)

| Area   | Pattern              | Example                    |
|--------|----------------------|----------------------------|
| Admin  | `Admin*Page` or `*ManagementPage` | `AdminDashboardPage`, `ClientsManagementPage`, `EmployeesManagementPage` |
| Portal | `Portal*Page`        | `PortalDashboardPage`      |
| Public | descriptive name     | `HomePage`, `AboutPage`    |

File name must match the exported component: `AdminDashboardPage.tsx` exports `AdminDashboardPage`.

### Components

- **PascalCase** file and export names: `PostsManagementWeeksTable.tsx` → `PostsManagementWeeksTable`.
- Prefer **named exports** over default exports.
- Prefix portal-only components with `Portal` when they mirror admin patterns (e.g. `PortalSidebar`, `PortalPostsTable`).

### Constants & types

- Constants: **SCREAMING_SNAKE** for primitives (`ANALYTICS_TAB_PARAM`), camelCase for objects/arrays (`dashboardQuickLinks`).
- Types/interfaces: **PascalCase** (`PostDialogProps`, `PostsStatCard`).
- Props types suffix: `*Props`.

## Admin vs portal

- Admin routes: `/admin/*` — shell in `admin-shell`, layout `AdminLayout`.
- Portal routes: `/portal/*` — shell in `portal-shell`, layout `PortalLayout`.
- Keep naming symmetric between the two (`AdminDashboardPage` / `PortalDashboardPage`, `Sidebar` / `PortalSidebar`).

## Supabase & migrations

- Schema DDL and RLS live in **`scripts/*.sql`** (run once in Supabase → SQL Editor).
- Feature-specific setup notes go in feature docs (e.g. `client.md`, `employee.md`).
- Repositories in `utils/*Repository.ts` map camelCase TS fields to snake_case DB columns.
- **Many-to-many links** (e.g. employee ↔ client) use one junction table with `started_at` / `ended_at`: active when `ended_at IS NULL`, history when set. Do not split into two tables unless requirements diverge.
- Keep **backend V1 simple**. Avoid unnecessary abstractions, over-engineering, and complex SQL. Focus on clean UX, maintainability, and maximum results with minimal code.

## Imports

- Use `@/` path alias (e.g. `@/features/dashboard/pages/AdminDashboardPage`).
- Import types with `import type { ... }`.
- shadcn UI components live in `src/shared/ui/`; configure `components.json` with `src/shared/...` paths (not literal `@/` folders).

## What not to do

- No types/constants buried in `.tsx` files (except short-lived locals inside a function).
- No default-export page components when a named export is used elsewhere.
- No new folders like `services/`, `models/`, `interfaces/` — use the structure above.
- No drive-by refactors or extra abstractions beyond the task scope.
- No one-line wrapper components that only forward props to a shared component.

## Checklist before finishing

1. Page/component names match file names and area prefix rules.
2. New types are in `types/`, new constants in `constants/`.
3. Router, sidebar nav, and imports updated for new routes.
4. SQL migration added under `scripts/` when a new table is needed.
5. Important mutations show `showToast` feedback where appropriate.
6. `bun run build` passes.
