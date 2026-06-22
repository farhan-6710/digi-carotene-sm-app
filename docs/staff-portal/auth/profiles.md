# Auth Profiles

Links Supabase Auth users to app roles and (for portal users) a client brand.

**Code:** `src/features/auth/`  
**Setup:** `profiles` table + RLS + signup trigger in `scripts/setup-database.sql`

---

## Database — `public.profiles`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `role` | text | No | CHECK: `staff`, `client`, `user` |
| `client_id` | uuid | Yes | FK → `clients.id` ON DELETE SET NULL |

### Roles

| Role | App behavior |
|------|--------------|
| `staff` | Full `/staff-portal` access |
| `client` | `/client-portal` access; requires non-null `client_id` |
| `user` | Treated like `staff` in app (legacy default) |

### Signup trigger

On new `auth.users` insert → auto-insert `profiles` row:

| Signup path | `profiles.role` |
|-------------|-----------------|
| Default (`/auth?form-type=signup`) | `client` |
| Staff signup (`/auth?form-type=signup&portal=staff` + access code) | `staff` |

Email signup passes `signup_portal: staff` in auth metadata (read by the trigger).  
Google staff signup creates a `client` profile first, then the app promotes it to `staff` after OAuth when the account is new.

Defined in `scripts/setup-database.sql` (`handle_new_user` + `on_auth_user_created`).  
Existing DBs: run `scripts/update-signup-staff-trigger.sql` once.

### RLS policies

| Policy | Operation | Rule |
|--------|-----------|------|
| Users read own profile | SELECT | `id = auth.uid()` |
| Users update own profile | UPDATE | `id = auth.uid()` |
| Staff update any profile | UPDATE | caller's profile has `role = 'staff'` |

Portal data policies (on `clients` / `posts`) are in the same setup script — see [database.md](../../database.md).

---

## DTOs

Types: `src/features/auth/types/profile.ts`

```ts
type UserRole = "staff" | "client" | "user";

type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
};
```

---

## Manual setup (after signup)

**Promote to staff:**

```sql
update public.profiles
set role = 'staff', client_id = null
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
