# Clients Management

Company registry: name, contact, website. Social profile URLs live on **projects**, not clients.

**Route:** `/staff-portal/clients-management`  
**Code:** `src/features/clients-management/`  
**Setup:** included in `scripts/migrations/001_initial_schema.sql`

---

## Database — `public.clients`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK, `gen_random_uuid()` |
| `client_name` | text | No | Company / brand name |
| `mobile_number` | text | Yes | Contact phone |
| `website_name` | text | Yes | Website URL or label |
| `created_at` | timestamptz | No | Default `now()` |
| `updated_at` | timestamptz | No | Auto-updated via trigger |

### Foreign keys & deletes

- `profiles.client_id` → `clients.id` ON DELETE SET NULL (portal users keep login, lose portal access).
- `projects.client_id` → `clients.id` ON DELETE CASCADE (deleting client removes its projects).

### RLS

- Authenticated users: full CRUD (`Authenticated users manage clients`).
- Portal users: SELECT own row where `id = profiles.client_id`.

---

## DTOs

Types: `src/features/clients-management/types/types.ts`

### Domain

```ts
type Client = {
  id: string;
  client_name: string;
  mobile_number: string | null;
  website_name: string | null;
  created_at: string;
};
```

### Repository inputs

```ts
type CreateClientInput = {
  clientName: string;
  mobileNumber?: string | null;
  websiteName?: string | null;
};

type UpdateClientInput = CreateClientInput;
```

### Form values

```ts
type ClientFormValues = {
  clientName: string;
  mobileNumber: string;
  websiteName: string;
};
```

### DB column mapping

| TS (camelCase) | DB (snake_case) |
|----------------|-----------------|
| `clientName` | `client_name` |
| `mobileNumber` | `mobile_number` |
| `websiteName` | `website_name` |

---

## UI flow

1. **Clients Management** — list, add, edit, delete clients.
2. **Client detail** — profile card + list of projects for this client (links to Projects).
3. Before deleting a client: remove or reassign linked projects and portal profile links.

---

## Related docs

- [Projects](../projects-management/projects.md) — social URLs and posts
- [Auth profiles](../auth/profiles.md) — portal `client_id` linking
