# Auth Profiles

Links Supabase Auth users to app roles and portal access via linked ids.

**Code:** `src/features/auth/`  
**Setup:** `profiles` table + RLS + signup trigger in `scripts/migrations/001_initial_schema.sql`

---

## Database — `public.profiles`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `role` | text | No | CHECK: `team`, `client`, `user` |
| `client_id` | uuid | Yes | FK → `clients.id` — required for client portal |
| `team_member_id` | uuid | Yes | FK → `team_members.id` — required for team portal |

### Roles & portal access

| Role | Portal access requires |
|------|------------------------|
| `user` | Default on signup — pending until email matches roster |
| `team` | `team_member_id` set (plus `role = team`) |
| `client` | `client_id` set (plus `role = client`) |

### Auto-link by email (migration 011)

One function — `link_profile_by_email(email)` — plus triggers:

| When | What runs |
|------|-----------|
| User signs up | `handle_new_user` creates profile, then links if email matches |
| Team saves team member | `on_team_member_portal_link` |
| Team saves client (with email) | `on_client_portal_link` |

Team member email wins if both match. Lookup is by indexed email on `auth.users` — one profile row updated, no table scan. Realtime on `profiles` picks up changes for logged-in users.

Requires `clients.email` (migration 009). If linking still fails after the staff → team rename, run `014_fix_link_profile_team_role.sql` and `015_ensure_profile_link_triggers.sql`.

### App fallback sync

`loadProfileForUser` also runs `syncProfileAccessForUser` — on login/refresh, the signed-in user’s email is matched to `team_members` / `clients` and their own `profiles` row is updated if out of sync.

After creating or updating a team member, the app calls `link_profile_by_email` RPC (migration 015 grants execute) as a fallback when DB triggers are missing.

### Signup flow (V1)

1. User signs up at `/auth?form-type=signup` with **email magic link** or **Google** (no password).
2. Profile created with `role = user` → redirected to `/user-portal` (pending).
3. Team creates a **team member** or **client** with that email → DB links profile automatically (or links on signup if roster row already existed).
4. User refreshes → correct portal.

### Signup trigger

On new `auth.users` insert → auto-insert `profiles` row, then `link_profile_by_email`.

Defined in `scripts/migrations/001_initial_schema.sql`. Existing DBs: run `scripts/migrations/011_auto_link_profiles_by_email.sql` once.

---

## DTOs

Types: `src/features/auth/types/profile.ts`

```ts
type UserRole = "team" | "client" | "user";

type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
  team_member_id: string | null;
};
```

---

## Manual override (rare)

If auto-link did not run (wrong email, migration not applied):

```sql
update public.profiles
set role = 'team',
    team_member_id = '<team-members-table-uuid>',
    client_id = null
where id = '<auth-user-uuid>';
```

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
- **`team_members`** — internal team roster; link via `profiles.team_member_id`. Deleting a row resets linked profiles to `role = user` and clears `team_member_id`.

---

## Related docs

- [Clients](../clients-management/clients.md)
- [Database setup](../../database.md)
