# Projects Management

Operational unit: social profile URLs, manager, team, and posts. Each project belongs to one client.

**Route:** `/team-portal/projects-management`  
**Code:** `src/features/projects-management/`  
**Setup:** included in `scripts/migrations/001_initial_schema.sql`

---

## Database — `public.projects`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK |
| `project_name` | text | No | Engagement / account name |
| `client_id` | uuid | No | FK → `clients.id` ON DELETE CASCADE |
| `socials` | jsonb | No | Default `{}`; profile URLs per platform |
| `manager_id` | uuid | No | FK → `team_members.id` ON DELETE RESTRICT |
| `created_at` | timestamptz | No | |
| `updated_at` | timestamptz | No | Auto-updated |

### `socials` jsonb shape

```json
{
  "facebook": "https://facebook.com/...",
  "instagram": "https://instagram.com/...",
  "linkedin": "https://linkedin.com/...",
  "youtube": "https://youtube.com/...",
  "google": "https://business.google.com/..."
}
```

All keys optional. Same client with different brands → separate projects with different `socials`.

---

## Database — `public.project_team_members`

Additional team members (manager is on `projects.manager_id`, not duplicated here).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK |
| `project_id` | uuid | No | FK → `projects.id` ON DELETE CASCADE |
| `member_id` | uuid | No | FK → `team_members.id` ON DELETE CASCADE |
| `started_at` | timestamptz | No | Default `now()` |
| `ended_at` | timestamptz | Yes | NULL = active assignment |
| `created_at` | timestamptz | No | |
| `updated_at` | timestamptz | No | Auto-updated |

### RLS

Both tables: authenticated users full CRUD.

### Role-based list scope (app layer)

Which projects appear in Projects Management / Posts Management / project pickers is controlled in `src/shared/utils/rbac.ts`:

```ts
PROJECT_DATA_SCOPE_BY_ROLE = {
  admin: "all",
  manager: "assigned",
  executive: "assigned",
}
```

- **`all`** — every project (admin today).
- **`assigned`** — projects where the user is `manager_id` **or** an active row in `project_team_members`.

Posts month lists filter by the same scoped project ids. Flip a role to `"all"` in that map to restore unfiltered lists in one place. Analytics / client detail still use unscoped fetchers where appropriate.

Services: `fetchProjectsScoped`, `resolveScopedProjectIds` in `projectsService.ts`.

### Midnight post digest email

Config matrix (TypeScript): `src/shared/constants/postDigestEmail.ts` (`POST_DIGEST_SECTIONS_BY_ROLE`).

Cron runner (PHP + Resend, same CLI/HTTP pattern as Growth): [`scripts/post-digest/php/README.md`](../../../scripts/post-digest/php/README.md).

| Role | Sections (one email each, midnight `Asia/Kolkata`) |
|------|-----------------------------------------------------|
| `executive` | Today’s posts on projects where they have an **active** `project_team_members` row |
| `manager` | Today’s posts on projects they **manage** (`manager_id`) + yesterday’s still **`Not posted`** on those projects |
| `admin` | Yesterday’s **`Not posted`** across **all** projects (single ordered list) |

Lists ordered by `to_be_posted_date`, then `to_be_posted_time`. Empty digests are not emailed.

---

## DTOs

Types: `src/features/projects-management/types/types.ts`

### Domain

```ts
type ProjectSocials = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  google?: string;
};

type ProjectClient = {
  id: string;
  client_name: string;
};

type ProjectManager = {
  id: string;
  member_name: string;
  role: string;
};

type Project = {
  id: string;
  project_name: string;
  client_id: string;
  socials: ProjectSocials | null;
  manager_id: string;
  created_at: string;
  updated_at: string;
  clients?: ProjectClient | null;
  team_members?: ProjectManager | null;
};

type ProjectListItem = Project & {
  clients: ProjectClient | null;
  team_members: ProjectManager | null;
  team_member_ids: string[];
};

type ProjectTeamAssignment = {
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
    clients: ProjectClient | null;
  } | null;
};

type ManagedProject = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  clients: ProjectClient | null;
};
```

### Service inputs

```ts
type CreateProjectInput = {
  projectName: string;
  clientId: string;
  managerId: string;
  socials?: ProjectSocials | null;
  teamMemberIds?: string[];
};

type UpdateProjectInput = CreateProjectInput;
```

### Form values

```ts
type ProjectFormValues = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds: string[];
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  google: string;
};
```

### DB column mapping

| TS | DB |
|----|-----|
| `projectName` | `project_name` |
| `clientId` | `client_id` |
| `managerId` | `manager_id` |
| `socials` | `socials` (jsonb) |
| `teamMemberIds` | rows in `project_team_members` |

---

## UI flow

1. Select **client** (combobox).
2. Enter **project name** and **social profile URLs**.
3. Select **manager** (required; must be a `team_members` row with role `manager`).
4. Optionally select **extra team members** (multi-select).
5. Create **posts** against this project.

Deleting a project fails if posts still reference it (`ON DELETE RESTRICT` on `posts.project_id`).

---

## Related docs

- [Clients](../clients-management/clients.md)
- [Posts](../posts-management/posts.md)
- [Team members](../team-management/team-members.md)
