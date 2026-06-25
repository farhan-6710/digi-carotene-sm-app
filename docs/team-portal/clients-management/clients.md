# Clients Management

Company registry: name, contact, website. Social profile URLs live on **projects**, not clients.

**Route:** `/team-portal/clients-management`  
**Code:** `src/features/clients-management/`  
**Setup:** included in `scripts/migrations/001_initial_schema.sql`

---

## Database — `public.clients`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK, `gen_random_uuid()` |
| `client_name` | text | No | Company / brand name |
| `email` | text | Yes | Portal user email (unique when set); used to auto-link `profiles.client_id` |
| `mobile_number` | text | Yes | Contact phone |
| `website_name` | text | Yes | Website URL or label |
| `created_at` | timestamptz | No | Default `now()` |
| `updated_at` | timestamptz | No | Auto-updated via trigger |

Unique index on `lower(trim(email))` where `email is not null`.

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
  email: string | null;
  mobile_number: string | null;
  website_name: string | null;
  created_at: string;
};
```

### Repository inputs

```ts
type CreateClientInput = {
  clientName: string;
  email?: string | null;
  mobileNumber?: string | null;
  websiteName?: string | null;
};

type UpdateClientInput = CreateClientInput;
```

### Form values

```ts
type ClientFormValues = {
  clientName: string;
  email: string;
  mobileNumber: string;
  websiteName: string;
};
```

### DB column mapping

| TS (camelCase) | DB (snake_case) |
|----------------|-----------------|
| `clientName` | `client_name` |
| `email` | `email` |
| `mobileNumber` | `mobile_number` |
| `websiteName` | `website_name` |

---

## UI flow

1. **Clients Management** — list, add, edit, delete clients. **Portal user email** links portal access when it matches a signup email (DB trigger).
2. **Client detail** — profile card + list of projects for this client (links to Projects).
3. Before deleting a client: remove or reassign linked projects. Deleting the client resets linked profiles to pending (`role = user`, `client_id = null`).

---

## Related docs

- [Projects](../projects-management/projects.md) — social URLs and posts
- [Auth profiles](../auth/profiles.md) — portal `client_id` linking
