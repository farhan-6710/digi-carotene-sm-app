import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import type { StatusKey } from "@/features/posts-management/types/types";

/**
 * Midnight post digest email — which sections each `team_members.role` receives.
 *
 * Domain terms (see docs/team-portal/posts-management/posts.md,
 * docs/team-portal/team-management/team-members.md,
 * docs/team-portal/projects-management/projects.md):
 *
 * - Schedule day  → `posts.to_be_posted_date` (“To be posted on”)
 * - Status        → `posts.status` (`StatusKey`: "Not posted" | "Scheduled" | "Posted")
 * - Managed       → `projects.manager_id` = recipient’s `team_members.id`
 * - On team       → active `project_team_members` row (`ended_at IS NULL`);
 *                   manager is NOT duplicated there
 *
 * Distinct from `PROJECT_DATA_SCOPE_BY_ROLE.assigned` (manager_id OR team),
 * which scopes portal lists — digests use the narrower relationships above.
 *
 * Runs once daily at midnight (agency timezone). One email per recipient.
 * PHP cron: scripts/post-digest/php/send_midnight_post_digest.php
 * Keep PHP lib/digest.php postDigestSectionsByRole() in sync with this map.
 */

/** Status filter for overdue / missed digests — exact DB CHECK value. */
export const POST_DIGEST_NOT_POSTED_STATUS: StatusKey = "Not posted";

/**
 * Digest sections a role can include.
 * IDs encode: day window + status filter (if any) + project relationship.
 */
export const POST_DIGEST_SECTIONS = [
  /** Today’s `to_be_posted_date`, recipient on active project_team_members. */
  "today_to_be_posted_on_team",
  /** Today’s `to_be_posted_date`, recipient is projects.manager_id. */
  "today_to_be_posted_managed",
  /** Yesterday’s `to_be_posted_date` + status Not posted, recipient is manager_id. */
  "yesterday_not_posted_managed",
  /** Yesterday’s `to_be_posted_date` + status Not posted, every project (admin). */
  "yesterday_not_posted_all",
] as const;

export type PostDigestSection = (typeof POST_DIGEST_SECTIONS)[number];

/**
 * Sections included in the midnight digest per team role.
 * Empty array = no digest for that role.
 * Order in each array = section order inside the email body.
 */
export const POST_DIGEST_SECTIONS_BY_ROLE: Record<
  TeamMemberRole,
  readonly PostDigestSection[]
> = {
  executive: ["today_to_be_posted_on_team"],
  manager: ["today_to_be_posted_managed", "yesterday_not_posted_managed"],
  admin: ["yesterday_not_posted_all"],
};

/** Email subject / heading labels (human text; section IDs stay snake_case). */
export const POST_DIGEST_SECTION_LABELS: Record<PostDigestSection, string> = {
  today_to_be_posted_on_team: "Today’s postings (your projects)",
  today_to_be_posted_managed: "Today’s postings (projects you manage)",
  yesterday_not_posted_managed: "Yesterday’s not posted (projects you manage)",
  yesterday_not_posted_all: "Yesterday’s not posted (all projects)",
};

/**
 * Default sort for every digest list — same as month load in posts.md:
 * `to_be_posted_date`, then `to_be_posted_time`.
 */
export const POST_DIGEST_ORDER_BY = [
  "to_be_posted_date",
  "to_be_posted_time",
] as const;

/**
 * Agency timezone for “today” / “yesterday” and the 12:00 AM cron window.
 * Align the cron schedule with this zone (e.g. GoDaddy cron or Edge schedule).
 */
export const POST_DIGEST_TIMEZONE = "Asia/Kolkata";
