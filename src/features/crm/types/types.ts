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
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type LeadAttachment = {
  id: string;
  lead_id: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadActivityStatus = "pending" | "in_progress" | "completed";
export type LeadActivityPriority = "low" | "medium" | "high";
export type LeadMeetingVenue = "client_location" | "in_office" | "online";

export type LeadTask = {
  id: string;
  lead_id: string;
  title: string;
  description: string | null;
  priority: LeadActivityPriority;
  status: LeadActivityStatus;
  created_at: string;
  updated_at: string;
};

export type LeadMeeting = {
  id: string;
  lead_id: string;
  title: string;
  description: string | null;
  status: LeadActivityStatus;
  from_date: string;
  from_time: string;
  to_date: string;
  to_time: string;
  venue: LeadMeetingVenue;
  created_at: string;
  updated_at: string;
};

export type LeadCall = {
  id: string;
  lead_id: string;
  title: string;
  description: string | null;
  status: LeadActivityStatus;
  start_date: string;
  start_time: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
};

export type CreateLeadAttachmentInput = {
  url: string;
  label?: string | null;
};

export type CreateLeadTaskInput = {
  title: string;
  description?: string | null;
  priority: LeadActivityPriority;
  status: LeadActivityStatus;
};

export type UpdateLeadTaskInput = Partial<CreateLeadTaskInput>;

export type CreateLeadMeetingInput = {
  title: string;
  description?: string | null;
  status: LeadActivityStatus;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  venue: LeadMeetingVenue;
};

export type UpdateLeadMeetingInput = Partial<CreateLeadMeetingInput>;

export type CreateLeadCallInput = {
  title: string;
  description?: string | null;
  status: LeadActivityStatus;
  startDate: string;
  startTime: string;
  durationMinutes: number;
};

export type UpdateLeadCallInput = Partial<CreateLeadCallInput>;
