# Digi Carotene

Service management app for **Digi Carotene**, a digital marketing agency.

**Team portal** — clients, projects, posts, production plans, team, Growth (Meta), reports.  
**Client portal** — read-only posts and analytics for that brand.

New developers: start at **[docs-2026-08-22/README.md](docs-2026-08-22/README.md)**.

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # output → dist/  (deploy dist + .htaccess + php/)
bun run lint
```

Supabase SQL: new project → `scripts/migrations/001_initial_schema.sql`. Existing → only unapplied files in `scripts/migrations/` ([guide](scripts/migrations/README.md)).

Architecture: [DESIGN.md](DESIGN.md) · Code rules: [AGENTS.md](AGENTS.md) · Crons & Meta: [docs-2026-08-22/ops.md](docs-2026-08-22/ops.md)
