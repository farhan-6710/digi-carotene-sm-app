export const LEAD_STATUSES = [
  "attempted_to_contact",
  "contact_in_future",
  "contacted",
  "junk_lead",
  "lost_lead",
  "not_contacted",
  "pre_qualified",
  "not_qualified",
] as const;

export const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> =
  {
    attempted_to_contact: "Attempted to Contact",
    contact_in_future: "Contact in Future",
    contacted: "Contacted",
    junk_lead: "Junk Lead",
    lost_lead: "Lost Lead",
    not_contacted: "Not Contacted",
    pre_qualified: "Pre-Qualified",
    not_qualified: "Not Qualified",
  };

export const DEFAULT_LEAD_STATUS = "not_contacted" as const;
