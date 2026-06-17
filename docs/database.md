# Database setup

Full reset and fresh install for Supabase. Run in **SQL Editor** in order.

## Scripts

| Step | File                         | Action                                                            |
| ---- | ---------------------------- | ----------------------------------------------------------------- |
| 1    | `scripts/reset-database.sql` | Drop all app tables, triggers, functions; delete all `auth.users` |
| 2    | `scripts/setup-database.sql` | Create tables, `updated_at` triggers, RLS, signup profile trigger |

There are no incremental migration files — always reset then setup when schema changes.

## Tables

| Table                  | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `clients`              | Company / brand owner (contact only — no social URLs)       |
| `team_members`         | Internal staff                                              |
| `projects`             | Client engagement: social profile URLs, manager, posts      |
| `project_team_members` | Extra team on a project (assignment history via `ended_at`) |
| `posts`                | Scheduled content (`project_id` FK)                         |
| `profiles`             | Auth user roles + portal `client_id`                        |

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

## RLS summary (from setup-database.sql)

| Table                  | Admin (authenticated)              | Portal (client role)                          |
| ---------------------- | ---------------------------------- | --------------------------------------------- |
| `clients`              | Full CRUD                          | SELECT own row (`profiles.client_id`)         |
| `team_members`         | Full CRUD                          | —                                             |
| `projects`             | Full CRUD                          | —                                             |
| `project_team_members` | Full CRUD                          | —                                             |
| `posts`                | Full CRUD                          | SELECT posts for projects under linked client |
| `profiles`             | Read/update own; admins update any | Read/update own                               |

## After setup

1. Sign up at `/auth?form-type=signup`, then promote in SQL Editor:

```sql
update public.profiles
set role = 'admin', client_id = null
where id = '<auth-user-uuid>';
```

2. Add **clients** (companies).
3. Add **team members** (at least one with role **manager**).
4. Add **projects** (client + manager + social URLs).
5. Add **posts** (each post requires a project).

**Brand portal users:** sign up or create in Supabase → link via SQL (see [admin/auth/profiles.md](./admin/auth/profiles.md)).

Suggested admin nav / setup order: Clients → Team → Projects → Posts.

## Feature docs

See [README.md](./README.md) for per-feature schema details and DTOs.
