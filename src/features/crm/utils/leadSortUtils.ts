import type { LeadSortId } from "@/features/crm/constants/leadSort";
import type { Lead } from "@/features/crm/types/types";

export function sortLeads(leads: Lead[], sort: LeadSortId): Lead[] {
  const next = [...leads];

  next.sort((a, b) => {
    if (sort === "name_asc") {
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    }
    if (sort === "name_desc") {
      return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
    }
    if (sort === "oldest") {
      return a.created_at.localeCompare(b.created_at);
    }
    // newest (default)
    return b.created_at.localeCompare(a.created_at);
  });

  return next;
}
