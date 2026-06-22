# Auth Profiles

Links Supabase Auth users to app roles and portal access via linked ids.

**Code:** `src/features/auth/`  
**Setup:** `profiles` table + RLS + signup trigger in `scripts/migrations/001_initial_schema.sql`

---

## Database — `public.profiles`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `role` | text | No | CHECK: `staff`, `client`, `user` |
| `client_id` | uuid | Yes | FK → `clients.id` — required for client portal |
| `team_member_id` | uuid | Yes | FK → `team_members.id` — required for staff portal |

### Roles & portal access

| Role | Portal access requires |
|------|------------------------|
| `user` | Default on signup — pending until staff links ids below |
| `staff` | `team_member_id` set (plus `role = staff`) |
| `client` | `client_id` set (plus `role = client`) |

Signup alone does **not** grant portal access. Staff must link the appropriate id after the user signs up.

### Signup trigger

On new `auth.users` insert → auto-insert `profiles` row with `role = 'user'`, `client_id = null`, `team_member_id = null`.

Defined in `scripts/migrations/001_initial_schema.sql` (`handle_new_user` + `on_auth_user_created`).  
Existing DBs: run `scripts/migrations/006_profiles_team_member_id.sql` once.

### Signup flow (V1)

1. User signs up at `/auth?form-type=signup` with **email magic link** or **Google** (no password).
2. Profile created with `role = user` → redirected to `/user-portal` (pending).
3. Staff links `team_member_id` + sets `role = staff` → user refreshes → staff portal.
4. Staff links `client_id` + sets `role = client` → user refreshes → client portal.

---

## DTOs

Types: `src/features/auth/types/profile.ts`

```ts
type UserRole = "staff" | "client" | "user";

type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
  team_member_id: string | null;
};
```

---

## Manual setup (after signup)

**Grant staff portal access:**

```sql
update public.profiles
set role = 'staff',
    team_member_id = '<team-members-table-uuid>',
    client_id = null
where id = '<auth-user-uuid>';
```

**Grant client portal access:**

```sql
update public.profiles
set role = 'client',
    client_id = '<clients-table-uuid>',
    team_member_id = null
where id = '<auth-user-uuid>';
```

---

## Important distinctions

- **`profiles`** — who can log in and which portal they access (via linked ids).
- **`clients`** — company/brand records for operations and client portal.
- **`team_members`** — internal staff roster; link via `profiles.team_member_id`. Deleting a row resets linked profiles to `role = user` and clears `team_member_id`.

---

## Related docs

- [Clients](../clients-management/clients.md)
- [Database setup](../../database.md)
