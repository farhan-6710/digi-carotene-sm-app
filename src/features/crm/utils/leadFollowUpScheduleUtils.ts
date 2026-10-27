import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";
import type { LeadFollowUp } from "@/features/crm/types/types";

/** Local due instant. Date-only → end of that local day. Invalid → null. */
export function getFollowUpDueAt(followUp: LeadFollowUp): Date | null {
  const date = followUp.follow_up_date?.trim() ?? "";
  if (!date) return null;

  const time = followUp.follow_up_time?.trim() ?? "";
  if (time) {
    return parseDateTime(date, time);
  }

  const parsed = parseUrlDateParam(date);
  if (!parsed) return null;
  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
    23,
    59,
    59,
    999,
  );
}

export function getFollowUpSortKey(followUp: LeadFollowUp): number {
  return getFollowUpDueAt(followUp)?.getTime() ?? Number.POSITIVE_INFINITY;
}

export function isFollowUpOverdue(
  followUp: LeadFollowUp,
  now: Date = new Date(),
): boolean {
  if (followUp.status !== "pending") return false;
  const dueAt = getFollowUpDueAt(followUp);
  if (!dueAt) return false;
  return dueAt.getTime() < now.getTime();
}

export function isFollowUpUpcoming(
  followUp: LeadFollowUp,
  now: Date = new Date(),
): boolean {
  if (followUp.status !== "pending") return false;
  const dueAt = getFollowUpDueAt(followUp);
  if (!dueAt) return false;
  return dueAt.getTime() >= now.getTime();
}

/** Earliest pending by due time; equal times → id. */
export function getNextPendingFollowUp(
  followUps: LeadFollowUp[],
): LeadFollowUp | null {
  const pending = followUps
    .filter((row) => row.status === "pending" && getFollowUpDueAt(row))
    .sort((a, b) => {
      const diff = getFollowUpSortKey(a) - getFollowUpSortKey(b);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });

  return pending[0] ?? null;
}

/** Latest follow-up with a given status (for completed / no-response filters). */
export function getLatestFollowUpByStatus(
  followUps: LeadFollowUp[],
  status: LeadFollowUp["status"],
): LeadFollowUp | null {
  const matched = followUps
    .filter((row) => row.status === status && getFollowUpDueAt(row))
    .sort((a, b) => {
      const diff = getFollowUpSortKey(b) - getFollowUpSortKey(a);
      if (diff !== 0) return diff;
      return b.id.localeCompare(a.id);
    });
  return matched[0] ?? null;
}

export function sortFollowUpsChronologically(
  followUps: LeadFollowUp[],
): LeadFollowUp[] {
  return [...followUps].sort((a, b) => {
    const diff = getFollowUpSortKey(a) - getFollowUpSortKey(b);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
}
