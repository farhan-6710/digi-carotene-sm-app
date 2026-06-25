# Post Approvals

Approval workflow when an **executive** creates a post with a **to be posted** date/time in the past.

**Route:** `/team-portal/post-approvals`  
**Code:** `src/features/post-approvals/`  
**Setup:** `scripts/migrations/013_post_approval_requests.sql`

---

## Business rules

| Rule | Behavior |
|------|----------|
| Trigger | Executive **creates** a new post where `to_be_posted` date/time is before now |
| Bypass | Managers and admins create backdated posts directly in `posts` |
| Reviewers | Project manager (`projects.manager_id`) or any admin |
| Pending | Row in `post_approval_requests`; **no row in `posts`** |
| Approved | Post created from `post_payload`; `approved_post_id` set |
| Rejected | Request closed; post is never created |

Review rules are enforced in the app. RLS matches other team tables: authenticated team users have full access.

---

## Database — `public.post_approval_requests`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `status` | text | `pending`, `approved`, `rejected` |
| `project_id` | uuid | FK → `projects.id` |
| `requested_by_team_member_id` | uuid | FK → `team_members.id` |
| `reviewed_by_team_member_id` | uuid | FK → `team_members.id` (nullable) |
| `reviewed_at` | timestamptz | |
| `rejection_reason` | text | Optional |
| `approved_post_id` | uuid | FK → `posts.id` after approve |
| `post_payload` | jsonb | Proposed post fields (same shape as create post input) |
| `created_at` | timestamptz | |

### `post_payload` shape

```ts
{
  projectId: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks: PostLinks | null;
  toBePostedOn: { date: string; time: string };
  posted: { date: string; time: string } | null;
  status: StatusKey;
}
```

---

## Related docs

- [Posts management](../posts-management/posts.md)
- [Projects](../projects-management/projects.md)
