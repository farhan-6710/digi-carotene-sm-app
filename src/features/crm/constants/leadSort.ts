export const LEAD_SORTS = [
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
] as const;

export type LeadSortId = (typeof LEAD_SORTS)[number];

export const DEFAULT_LEAD_SORT: LeadSortId = "newest";

export const LEAD_SORT_LABELS: Record<LeadSortId, string> = {
  newest: "Latest first",
  oldest: "Oldest first",
  name_asc: "Name A–Z",
  name_desc: "Name Z–A",
};

export const LEAD_MONTH_FILTER_ALL = "all";
