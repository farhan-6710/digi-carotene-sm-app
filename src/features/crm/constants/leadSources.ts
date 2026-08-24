export const LEAD_SOURCES = [
  "advertisement",
  "cold_call",
  "employee_referral",
  "external_referral",
  "online_store",
  "partner",
  "public_relations",
  "sales_email_alias",
  "seminar_partner",
  "internal_seminar",
  "trade_show",
  "web_download",
  "web_research",
  "chat",
  "x_twitter",
  "facebook",
] as const;

export const LEAD_SOURCE_LABELS: Record<(typeof LEAD_SOURCES)[number], string> =
  {
    advertisement: "Advertisement",
    cold_call: "Cold Call",
    employee_referral: "Employee Referral",
    external_referral: "External Referral",
    online_store: "Online Store",
    partner: "Partner",
    public_relations: "Public Relations",
    sales_email_alias: "Sales Email Alias",
    seminar_partner: "Seminar Partner",
    internal_seminar: "Internal Seminar",
    trade_show: "Trade Show",
    web_download: "Web Download",
    web_research: "Web Research",
    chat: "Chat",
    x_twitter: "X (Twitter)",
    facebook: "Facebook",
  };

export const DEFAULT_LEAD_SOURCE = "cold_call" as const;
