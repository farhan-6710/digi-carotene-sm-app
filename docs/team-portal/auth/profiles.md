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

Team member email wins if both match. Lookup is by indexed email on `auth.users` — one profile row updated, no table scan.

Requires `clients.email` (migration 009). If linking still fails, re-run `011_auto_link_profiles_by_email.sql` and `015_ensure_profile_link_triggers.sql` (015 makes `link_profile_by_email` set `role = 'team'` and re-creates the triggers).

### App fallback link

After creating or updating a team member or client, the app calls the `link_profile_by_email` RPC (migration 015 grants execute) from `services/profilesService.ts` as a fallback when DB triggers are missing. There is no realtime/visibility sync — a pending user signs in and **refreshes** (or uses the "Refresh access" button on `/user-portal`) to pick up new access.

### Signup flow (V1)

1. User signs up at `/auth?form-type=signup` with **email + password** or **Google**. ("Continue with Facebook" renders as a placeholder button that does nothing — portal Facebook auth is on hold until the Growth/analytics auth flow lands.)
2. Account is created and the user is signed in immediately (no email verification in V1).
3. Profile created with `role = user` → redirected to `/user-portal` (pending).
4. Team creates a **team member** or **client** with that email → DB links profile automatically (or links on signup if roster row already existed).
5. User refreshes → correct portal.

**Supabase OAuth setup**

| Provider | Supabase dashboard |
|----------|-------------------|
| Google | Authentication → Providers → Google — Client ID + secret |
| Facebook | Authentication → Providers → Facebook — App ID + secret from [Meta for Developers](https://developers.facebook.com/) |

Add your site URL and redirect URL (`https://<project-ref>.supabase.co/auth/v1/callback`) in the Meta app **Facebook Login** settings.

**Facebook login is on hold.** The "Continue with Facebook" button in `AuthOAuthSignIn` is a placeholder (no `onClick`) until the Growth/analytics auth flow is designed. Only Google + email/password work today. When re-enabling, note: portal login uses Supabase's standard `signInWithOAuth` (scope-based, `email` + `public_profile`), which only works with a **Consumer** Meta app using the plain **Facebook Login** product. Do **not** reuse a **Business** app or the **Facebook Login for Business** product — those require a `config_id` that Supabase cannot send, and real (non-tester) users get *"It looks like this app isn't available. This app needs at least one supported permission."* Keep portal-login and the ads/Instagram analytics apps separate. Set the app to **Live** (standard login needs no App Review).

**Instagram:** Supabase Auth has no Instagram login provider. Users sign in with Facebook (Meta), email/password, or Google. Instagram in this app is for **Growth analytics** (page tokens), not portal signup.

**Supabase email:** disable **Confirm email** under Authentication → Providers → Email so `signUp` returns a session without a verification mail.

### Set / change password (Account page)

OAuth and email users can set an email/password login from **Account** (team + client portals).

- UI: `AccountPasswordCard` + `AccountPasswordDialog` (`src/shared/components/account/`)
- Service: `updatePassword` in `authService.ts` → `supabase.auth.updateUser({ password, data: { password_set: true } })`
- Hash lives in **`auth.users`** (Supabase Auth). **Never** store passwords on `profiles`.
- Status: `userHasPasswordLogin(user)` — true if `user_metadata.password_set` or an `email` identity exists.
- Saved passwords cannot be revealed later (Auth hashes only). Use **Set a password** / **Change password** to open the modal; the eye toggle is only for typing in the modal.
- **Remove password** (modal, with `ConfirmationModal`): only when the user still has another sign-in method (e.g. Google). Calls `unlinkIdentity` on the email identity + clears `password_set`. Email-only accounts cannot remove their only login method.

### Reset password (email link)

Forgot-password flow on `/auth`:

1. Login → **Forgot password?** → `/auth?form-type=forgot-password`
2. `requestPasswordReset(email)` → `supabase.auth.resetPasswordForEmail` with redirect `/auth?form-type=reset-password`
3. User opens email link → Supabase fires `PASSWORD_RECOVERY` → `AuthProvider.isPasswordRecovery`
4. Auth page shows **Choose a new password** → same `updatePassword` helper

**Supabase dashboard:** Authentication → URL Configuration — add your site URL and redirect allow list entry for  
`https://<your-domain>/auth?form-type=reset-password` (and localhost in dev).

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
