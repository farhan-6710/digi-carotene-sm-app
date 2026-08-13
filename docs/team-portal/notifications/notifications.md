# Notifications

In-app inbox for team members. Lives at `/team-portal/notifications`.

**Code:** `src/features/notifications/`  
**Service:** `src/services/notificationsService.ts`  
**Setup:** `scripts/migrations/033_notifications.sql`

---

## Business rules

| Rule | Behavior |
|------|----------|
| Purpose | Per-user inbox: mark read / dismiss (X). Not the approval workflow itself. |
| Approvals workflow | Still `post_approval_requests` (approve / reject / payload) |
| Link | `notification_type = 'approval'` + `related_id = post_approval_requests.id` |
| Post digest | Midnight cron inserts `post_digest` when an email is sent |
| Unread only | Page lists `status = unread`; dismiss or review sets `read` |

---

## Database — `public.notifications`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `recipient_team_member_id` | uuid | FK → `team_members.id` |
| `notification_type` | text | `approval`, `post_digest` |
| `title` | text | Short heading |
| `message` | text | Body preview |
| `status` | text | `unread`, `read` |
| `related_id` | uuid | Approval request id for `approval`; null for digest |
| `created_at` | timestamptz | |
| `read_at` | timestamptz | Set when marked read |

---

## Related docs

- [Post approvals](../post-approvals/post-approval-requests.md)
- [PHP crons](../../../scripts/php/README.md)
