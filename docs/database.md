# Database setup

Schema is managed with **numbered migrations** in [`scripts/migrations/`](../scripts/migrations/). Run SQL in the Supabase **SQL Editor**.

See [`scripts/migrations/README.md`](../scripts/migrations/README.md) for the full guide.

## Brand-new project

Run **only** [`scripts/migrations/001_initial_schema.sql`](../scripts/migrations/001_initial_schema.sql).

## Existing project

Run only the migrations you have not applied yet, in order (`002` onward). See [`scripts/migrations/README.md`](../scripts/migrations/README.md) for the per-file checklist, and skip any step already reflected in your database.

**Do not** edit old migration files after they have been applied. Add a new numbered file for every schema change.

## Tables

| Table                  | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `clients`              | Company / brand owner (contact only — no social URLs)       |
| `team_members`         | Internal team                                              |
| `projects`             | Client engagement: social profile URLs, manager, posts      |
| `project_team_members` | Extra team on a project (assignment history via `ended_at`) |
| `posts`                | Scheduled content (`project_id` FK)                         |
| `post_approval_requests` | Executive backdated post approval workflow              |
| `profiles`             | Auth user roles + portal `client_id`                        |
| `growth_organic_accounts` | Connected Instagram/Facebook profiles (Meta token + followers); `client_id` FK links the account to a client |
| `growth_ad_accounts`   | Connected Meta ad accounts; `client_id` FK links the account to a client |
| `growth_ad_campaign_daily_metrics` | Campaign daily ad metrics (backfill + cron)          |
| `growth_adsets`        | Ad set master rows (targeting / placement summaries)        |
| `growth_adset_daily_metrics` | Ad set daily metrics                                  |
| `growth_ads`           | Ad master rows (name, creative summary)                     |
| `growth_ad_daily_metrics` | Ad daily metrics                                         |
| `instagram_profiles`   | Instagram credentials + follower count (Phase 1 analytics)    |
| `past_posts_metrics`   | Post-level metrics from the 29-day connect backfill + daily sync |
| `instagram_daily_followers` | Net followers gained per day (backfill + midnight cron)   |

## Relationships

```
auth.users ──1:1── profiles
profiles.client_id ──► clients (portal access)
clients ──1:N── projects
projects.manager_id ──► team_members (required)
projects ──1:N── project_team_members ──► team_members
projects ──1:N── posts
```

## Domain rules

- **Client** — one company; portal users link here via `profiles.client_id`.
- **Project** — belongs to one client; holds `socials` jsonb + required `manager_id`.
- **Post** — belongs to one project; `socials` (platform tags) + `post_links` (published URLs) are per post.
- Same client, different social accounts → create another **project** under that client.
- Posts require a project — no project, no post.

## RLS summary (from 001_initial_schema.sql)

| Table                  | Team (authenticated)              | Client portal (client role)                   |
| ---------------------- | ---------------------------------- | --------------------------------------------- |
| `clients`              | Full CRUD                          | SELECT own row (`profiles.client_id`)         |
| `team_members`         | Full CRUD                          | —                                             |
| `projects`             | Full CRUD                          | —                                             |
| `project_team_members` | Full CRUD                          | —                                             |
| `posts`                | Full CRUD                          | SELECT posts for projects under linked client |
| `profiles`             | Read/update own; team update any  | Read/update own                               |

## After setup

1. Sign up at `/auth?form-type=signup` — default role is `user` (pending access at `/user-portal`).
2. To grant team access: add the user's email in **Team Management**, then they refresh → team portal.
3. Add **clients** (companies).
4. Add **team members** (at least one with role **manager**).
5. Add **projects** (client + manager + social URLs).
6. Add **posts** (each post requires a project).

**Client portal users:** team links `profiles.client_id` after signup (see [team-portal/auth/profiles.md](./team-portal/auth/profiles.md)).

Suggested team nav / setup order: Clients → Team → Projects → Posts.

## Feature docs

See [README.md](./README.md) for per-feature schema details and DTOs.

### Growth & Analytics

| Doc | Purpose |
|-----|---------|
| [growth-and-analytics/README.md](./growth-and-analytics/README.md) | Instagram backfill, ads campaign analytics, live breakdowns, daily sync |
| [scripts/growth-and-analytics/php/README.md](../scripts/growth-and-analytics/php/README.md) | GoDaddy PHP cron setup |
