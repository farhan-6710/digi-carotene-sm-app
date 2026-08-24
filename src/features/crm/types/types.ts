export type LeadStatus =
  | "attempted_to_contact"
  | "contact_in_future"
  | "contacted"
  | "junk_lead"
  | "lost_lead"
  | "not_contacted"
  | "pre_qualified"
  | "not_qualified";

export type LeadSource =
  | "advertisement"
  | "cold_call"
  | "employee_referral"
  | "external_referral"
  | "online_store"
  | "partner"
  | "public_relations"
  | "sales_email_alias"
  | "seminar_partner"
  | "internal_seminar"
  | "trade_show"
  | "web_download"
  | "web_research"
  | "chat"
  | "x_twitter"
  | "facebook";

export type LeadScore = 1 | 2 | 3 | 4 | 5;

export type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  lead_score: LeadScore;
  status: LeadStatus;
  lead_source: LeadSource;
  created_at: string;
  updated_at: string;
};
