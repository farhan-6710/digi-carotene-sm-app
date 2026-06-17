# Digi Carotene — Documentation

Reference docs for agents and developers. Source of truth for database schema, DTOs, and feature behavior.

## Database setup

| Doc | Purpose |
|-----|---------|
| [database.md](./database.md) | Full reset + setup, domain model, table overview |

**Scripts (Supabase SQL Editor, in order):**

1. `scripts/reset-database.sql` — wipe all tables + auth users
2. `scripts/setup-database.sql` — create schema, RLS, signup trigger

## Admin features

| Feature | Doc |
|---------|-----|
| Auth / profiles | [admin/auth/profiles.md](./admin/auth/profiles.md) |
| Clients | [admin/clients-management/clients.md](./admin/clients-management/clients.md) |
| Team members | [admin/team-management/team-members.md](./admin/team-management/team-members.md) |
| Projects | [admin/projects-management/projects.md](./admin/projects-management/projects.md) |
| Posts | [admin/posts-management/posts.md](./admin/posts-management/posts.md) |

## Domain hierarchy

```
clients (company)
  └── projects (social URLs, manager, team)
        └── posts (schedule, platform tags, post links)
team_members (internal staff)
profiles (auth roles + portal client_id)
```

TypeScript types live in `src/features/<feature>/types/types.ts`. Each doc below mirrors those types as DTOs.
