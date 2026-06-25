# Team Members Management

Internal team CRUD and project-scoped assignments.

**Route:** `/team-portal/team-management`  
**Code:** `src/features/team-management/`  
**Setup:** included in `scripts/migrations/001_initial_schema.sql`

---

## Database — `public.team_members`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK |
| `member_name` | text | No | Display name |
| `email` | text | No | UNIQUE, stored lowercase |
| `mobile_number` | text | Yes | |
| `role` | text | No | CHECK: `executive`, `manager`, `admin` |
| `created_at` | timestamptz | No | |
| `updated_at` | timestamptz | No | Auto-updated |

### Roles

| Role | Usage |
|------|-------|
| `executive` | Default; general team member |
| `manager` | **Required** — must exist before creating projects (`projects.manager_id`) |
| `admin` | Internal admin role label (separate from `profiles.role`) |

### RLS

Authenticated users: full CRUD.

---

## Project team (not on this table)

| Mechanism | Table / column | Notes |
|-----------|----------------|-------|
| Project manager | `projects.manager_id` | Required on every project |
| Extra members | `project_team_members` | Active when `ended_at IS NULL` |

Team member detail page shows:

- **Managed projects** — from `projects` where `manager_id = member.id` (read-only tags).
- **Active project assignments** — from `project_team_members` (can end).
- **Project history** — past rows where `ended_at` is set.

Assign project from team detail → insert into `project_team_members`.

---

## DTOs

Types: `src/features/team-management/types/types.ts`

### Domain

```ts
type TeamMemberRole = "executive" | "manager" | "admin";

type TeamMember = {
  id: string;
  member_name: string;
  email: string;
  mobile_number: string | null;
  role: TeamMemberRole;
  created_at: string;
  updated_at: string;
};

type MemberProjectAssignment = {
  id: string;
  project_id: string;
  member_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  projects: {
    id: string;
    project_name: string;
    client_id: string;
    clients: { id: string; client_name: string } | null;
  } | null;
};

type ManagedProjectSummary = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  clients: { id: string; client_name: string } | null;
};
```

### Repository inputs

```ts
type CreateTeamMemberInput = {
  memberName: string;
  email: string;
  mobileNumber?: string | null;
  role: TeamMemberRole;
};

type UpdateTeamMemberInput = CreateTeamMemberInput;
```

### Form values

```ts
type TeamMemberFormValues = {
  memberName: string;
  email: string;
  mobileNumber: string;
  role: TeamMemberRole;
};
```

### DB column mapping

| TS | DB |
|----|-----|
| `memberName` | `member_name` |
| `email` | `email` |
| `mobileNumber` | `mobile_number` |
| `role` | `role` |

---

## UI flow

1. Add team members (include at least one **manager**).
2. Create **projects** with manager + optional team.
3. From team member detail: assign/end **project** assignments.

A member can be active on multiple projects (including as manager on one and team member on others).

---

## Related docs

- [Projects](../projects-management/projects.md)
- [Database setup](../../database.md)
