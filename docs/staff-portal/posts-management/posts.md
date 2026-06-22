# Posts Management

Scheduled content per **project**. Post-level platform tags and published links stay on each post row.

**Route:** `/admin/posts-management`  
**Code:** `src/features/posts-management/`  
**Setup:** included in `scripts/setup-database.sql`

---

## Database — `public.posts`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | No | PK |
| `project_id` | uuid | No | FK → `projects.id` ON DELETE RESTRICT |
| `post_title` | text | Yes | Optional title |
| `socials` | text[] | Yes | Platforms for this post |
| `post_links` | jsonb | No | Default `{}`; published URLs per platform |
| `scheduled_date` | date | No | Planned publish date |
| `scheduled_time` | text | No | e.g. `"10:00 AM"` |
| `posted_date` | date | Yes | Actual publish date |
| `posted_time` | text | Yes | Actual publish time |
| `status` | text | No | CHECK: `Not posted`, `Scheduled`, `Posted` |
| `created_at` | timestamptz | No | |
| `updated_at` | timestamptz | No | Auto-updated |

### Two “social” concepts

| Layer | Field | Meaning |
|-------|-------|---------|
| **Project** | `projects.socials` jsonb | Brand **profile URLs** (facebook.com/page, etc.) |
| **Post** | `posts.socials` text[] | Which **platforms** this post targets |
| **Post** | `posts.post_links` jsonb | **Published post URLs** after going live |

Post `socials` values: `Instagram`, `Facebook`, `LinkedIn`, `YouTube` (see constants).

### `post_links` jsonb shape

Keys are lowercase platform names:

```json
{
  "instagram": "https://instagram.com/p/...",
  "facebook": "https://facebook.com/..."
}
```

### Status values

| Status | Meaning |
|--------|---------|
| `Not posted` | Not live yet |
| `Scheduled` | Queued / auto-scheduled on platform |
| `Posted` | Published; set `posted_date` / `posted_time` when known |

### RLS

- Admin: full CRUD.
- Portal: SELECT where `project_id` belongs to a project under the user's `profiles.client_id`.

---

## DTOs

Types: `src/features/posts-management/types/types.ts`

### Domain

```ts
type StatusKey = "Not posted" | "Scheduled" | "Posted";

type SocialPlatform = "Instagram" | "Facebook" | "LinkedIn" | "YouTube";

type PostLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

type Post = {
  id: string;
  project_id: string;
  project_name?: string;   // joined for display
  client_name?: string;    // joined via project → client
  post_title: string | null;
  socials: string[] | null;
  post_links: PostLinks | null;
  scheduled_date: string;
  scheduled_time: string;
  posted_date: string | null;
  posted_time: string | null;
  status: StatusKey;
  created_at: string;
};
```

### Calendar UI types

```ts
type SlotClient = {
  id: string;
  projectId: string;
  name: string;              // project name
  clientName?: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks: PostLinks | null;
  scheduledDate: string;
  scheduledTime: string;
  postedDate: string | null;
  postedTime: string | null;
  status: StatusKey;
};

type Slot = {
  year: number;
  month: number;
  date: number;
  day: string;
  clients: SlotClient[];   // posts grouped per day
};
```

### Repository inputs

```ts
type CreatePostInput = {
  projectId: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks?: PostLinks | null;
  scheduled: { date: string; time: string };
  posted: { date: string; time: string } | null;
  status: StatusKey;
};

type UpdatePostInput = CreatePostInput;
```

### Form values

```ts
type PostFormValues = {
  projectId: string;
  projectName: string;
  postTitle: string;
  socials: string[];
  postLinks: Record<string, string>;
  toBePostedOn: PostDateTimeValue | null;
  postedOn: PostDateTimeValue | null;
  clientStatus: StatusKey;
};
```

### DB column mapping

| TS | DB |
|----|-----|
| `projectId` | `project_id` |
| `postTitle` | `post_title` |
| `socials` | `socials` |
| `postLinks` | `post_links` |
| `toBePostedOn` | `scheduled_date` + `scheduled_time` |
| `postedOn` | `posted_date` + `posted_time` |
| `clientStatus` | `status` |

---

## Month loading

When calendar shows May 2026:

```ts
await supabase
  .from("posts")
  .select("*, projects(project_name, clients(client_name))")
  .gte("scheduled_date", "2026-05-01")
  .lte("scheduled_date", "2026-05-31")
  .order("scheduled_date")
  .order("scheduled_time");
```

Frontend groups by `scheduled_date` into calendar cells.

---

## UI flow

1. At least one **project** must exist.
2. Add post → select **project** (not client).
3. Pick post **platforms** (multi-select).
4. Set schedule, status, and **post links** when published.

---

## Related docs

- [Projects](../projects-management/projects.md)
- [Database setup](../../database.md)
