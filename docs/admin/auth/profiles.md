# Auth Profiles

Links Supabase Auth users to app roles and (for portal users) a client brand.

**Code:** `src/features/auth/`  
**Setup:** `profiles` table + RLS + signup trigger in `scripts/setup-database.sql`

---

## Database — `public.profiles`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `role` | text | No | CHECK: `admin`, `client`, `user` |
| `client_id` | uuid | Yes | FK → `clients.id` ON DELETE SET NULL |

### Roles

| Role | App behavior |
|------|--------------|
| `admin` | Full `/admin` access |
| `client` | `/portal` access; requires non-null `client_id` |
| `user` | Treated like `admin` in app (legacy default) |

### Signup trigger

On new `auth.users` insert → auto-insert `profiles` row with `role = 'client'`, `client_id = null`.

Defined in `scripts/setup-database.sql` (`handle_new_user` + `on_auth_user_created`).

### RLS policies

| Policy | Operation | Rule |
|--------|-----------|------|
| Users read own profile | SELECT | `id = auth.uid()` |
| Users update own profile | UPDATE | `id = auth.uid()` |
| Admins update any profile | UPDATE | caller's profile has `role = 'admin'` |

Portal data policies (on `clients` / `posts`) are in the same setup script — see [database.md](../../database.md).

---

## DTOs

Types: `src/features/auth/types/profile.ts`

```ts
type UserRole = "admin" | "client" | "user";

type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
};
```

---

## Manual setup (after signup)

**Promote to admin:**

```sql
update public.profiles
set role = 'admin', client_id = null
where id = '<auth-user-uuid>';
```

**Link portal user to a client brand:**

```sql
update public.profiles
set role = 'client', client_id = '<clients-table-uuid>'
where id = '<auth-user-uuid>';
```

Use UUID from **Authentication → Users** for user id, and from **`public.clients`** for `client_id` (not the auth display name).

---

## Important distinctions

- **`profiles`** — who can log in and which area they access.
- **`clients`** — company/brand records for operations and portal.
- **`team_members`** — internal staff (separate from auth profiles unless you link them manually later).

Deleting a client sets linked `profiles.client_id` to NULL (portal user keeps login, loses portal data access until reassigned).

---

## Related docs

- [Clients](../clients-management/clients.md)
- [Database setup](../../database.md)
