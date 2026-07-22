# Digi Carotene — Documentation

Reference docs for the Digi Carotene service management app: database schema, DTOs, and feature behavior for team and client portals.

## Database setup

| Doc | Purpose |
|-----|---------|
| [database.md](./database.md) | Migrations, domain model, table overview |

**Scripts (Supabase SQL Editor):**

- New project: [`scripts/migrations/001_initial_schema.sql`](../scripts/migrations/001_initial_schema.sql)
- Existing project: see [`scripts/migrations/README.md`](../scripts/migrations/README.md)

## Team portal features

| Feature | Doc |
|---------|-----|
| Auth / profiles | [team-portal/auth/profiles.md](./team-portal/auth/profiles.md) |
| Clients | [team-portal/clients-management/clients.md](./team-portal/clients-management/clients.md) |
| Team members | [team-portal/team-management/team-members.md](./team-portal/team-management/team-members.md) |
| Projects | [team-portal/projects-management/projects.md](./team-portal/projects-management/projects.md) |
| Posts | [team-portal/posts-management/posts.md](./team-portal/posts-management/posts.md) |
| Post approvals | [team-portal/post-approvals/post-approval-requests.md](./team-portal/post-approvals/post-approval-requests.md) |
| Growth & Analytics | [growth-and-analytics/README.md](./growth-and-analytics/README.md) |
| Midnight post digest (PHP + Resend) | [scripts/post-digest/php/README.md](../scripts/post-digest/php/README.md) |

## Domain hierarchy

```
clients (company)
  └── projects (social URLs, manager, team)
        └── posts (schedule, platform tags, post links)
  └── growth_organic_accounts / growth_ads_accounts (Meta assets + client_id)
team_members (internal team)
profiles (auth roles + portal client_id)
```

TypeScript types live in `src/features/<feature>/types/types.ts`. Each doc below mirrors those types as DTOs.
