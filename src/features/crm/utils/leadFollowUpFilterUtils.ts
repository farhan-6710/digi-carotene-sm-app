import type { LeadFollowUpFilterId } from "@/features/crm/constants/leadFollowUpFilters";
import type { Lead, LeadFollowUp } from "@/features/crm/types/types";
import {
  getFollowUpSortKey,
  getLatestFollowUpByStatus,
  getNextPendingFollowUp,
  isFollowUpOverdue,
  isFollowUpUpcoming,
} from "@/features/crm/utils/leadFollowUpScheduleUtils";

function byLeadId(followUps: LeadFollowUp[]): Map<string, LeadFollowUp[]> {
  const map = new Map<string, LeadFollowUp[]>();
  for (const row of followUps) {
    const list = map.get(row.lead_id) ?? [];
    list.push(row);
    map.set(row.lead_id, list);
  }
  return map;
}

export function groupFollowUpsByLeadId(
  followUps: LeadFollowUp[],
): Map<string, LeadFollowUp[]> {
  return byLeadId(followUps);
}

function hasStatus(
  rows: LeadFollowUp[] | undefined,
  status: LeadFollowUp["status"],
): boolean {
  return Boolean(rows?.some((row) => row.status === status));
}

/** Filter leads by follow-up filter. Overdue/upcoming lists are re-sorted. */
export function filterLeadsByFollowUp(
  leads: Lead[],
  followUps: LeadFollowUp[],
  filter: LeadFollowUpFilterId,
  now: Date = new Date(),
): Lead[] {
  if (filter === "all") return leads;

  const grouped = byLeadId(followUps);

  if (filter === "all_pending") {
    return leads.filter((lead) =>
      Boolean(getNextPendingFollowUp(grouped.get(lead.id) ?? [])),
    );
  }

  if (filter === "completed") {
    return leads.filter((lead) => hasStatus(grouped.get(lead.id), "done"));
  }

  if (filter === "no_response") {
    return leads.filter((lead) =>
      hasStatus(grouped.get(lead.id), "didnt_respond"),
    );
  }

  if (filter === "overdue" || filter === "upcoming") {
    const match =
      filter === "overdue" ? isFollowUpOverdue : isFollowUpUpcoming;
    const matched = leads.filter((lead) =>
      (grouped.get(lead.id) ?? []).some((row) => match(row, now)),
    );
    return matched.sort((a, b) => {
      const aNext = getNextPendingFollowUp(grouped.get(a.id) ?? []);
      const bNext = getNextPendingFollowUp(grouped.get(b.id) ?? []);
      const aKey = aNext ? getFollowUpSortKey(aNext) : Number.POSITIVE_INFINITY;
      const bKey = bNext ? getFollowUpSortKey(bNext) : Number.POSITIVE_INFINITY;
      const diff = aKey - bKey;
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });
  }

  return leads;
}

/** Which follow-up to show in the listing cell for the active filter. */
export function getListingFollowUp(
  followUps: LeadFollowUp[],
  filter: LeadFollowUpFilterId,
): LeadFollowUp | null {
  if (filter === "completed") {
    return getLatestFollowUpByStatus(followUps, "done");
  }
  if (filter === "no_response") {
    return getLatestFollowUpByStatus(followUps, "didnt_respond");
  }
  return getNextPendingFollowUp(followUps);
}
