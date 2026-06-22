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
| `user` | Default on signup — `/user-portal` pending until access is granted |
| `staff` | Full `/staff-portal` access (email must match `team_members`) |
| `client` | `/client-portal` access; requires non-null `client_id` |

### Signup trigger

On new `auth.users` insert → auto-insert `profiles` row with `role = 'user'`, `client_id = null`.

After sign-in, the app syncs access:

- Email on `team_members` → promote to `staff`
- Staff sets `role = client` + `client_id` → client portal on next refresh

Defined in `scripts/setup-database.sql` (`handle_new_user` + `on_auth_user_created`).  
Existing DBs: run `scripts/update-signup-default-user-role.sql` once.

### Signup flow (V1)

1. User signs up at `/auth?form-type=signup` with **email magic link** or **Google** (no password).
2. Profile created with `role = user` → redirected to `/user-portal`.
3. Staff adds email to **Team Management** → user refreshes → staff portal.
4. Staff links `client_id` on profile → user refreshes → client portal.

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

Or add the user's email to `team_members` — the app promotes on refresh.

**Link portal user to a client brand:**

```sql
update public.profiles
set role = 'client', client_id = '<clients-table-uuid>'
where id = '<auth-user-uuid>';
```

---

## Important distinctions

- **`profiles`** — who can log in and which area they access.
- **`clients`** — company/brand records for operations and portal.
- **`team_members`** — internal staff roster; email match promotes `user` → `staff`.

---

## Related docs

- [Clients](../clients-management/clients.md)
- [Database setup](../../database.md)
