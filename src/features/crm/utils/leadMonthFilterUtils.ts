import { LEAD_MONTH_FILTER_ALL } from "@/features/crm/constants/leadSort";
import type { Lead } from "@/features/crm/types/types";

export function leadCreatedMonthKey(createdAt: string): string | null {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function filterLeadsByCreatedMonth(
  leads: Lead[],
  monthKey: string,
): Lead[] {
  if (monthKey === LEAD_MONTH_FILTER_ALL) return leads;
  return leads.filter(
    (lead) => leadCreatedMonthKey(lead.created_at) === monthKey,
  );
}
