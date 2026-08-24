import { DEFAULT_LEAD_SCORE } from "@/features/crm/constants/leadScores";
import { DEFAULT_LEAD_SOURCE } from "@/features/crm/constants/leadSources";
import { DEFAULT_LEAD_STATUS } from "@/features/crm/constants/leadStatuses";
import type {
  Lead,
  LeadScore,
  LeadSource,
  LeadStatus,
} from "@/features/crm/types/types";

export type LeadFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  leadScore: LeadScore;
  status: LeadStatus;
  leadSource: LeadSource;
};

export type LeadFormField = keyof LeadFormValues;

export const emptyLeadFormValues = (): LeadFormValues => ({
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  leadScore: DEFAULT_LEAD_SCORE,
  status: DEFAULT_LEAD_STATUS,
  leadSource: DEFAULT_LEAD_SOURCE,
});

export function leadToFormValues(lead: Lead): LeadFormValues {
  return {
    name: lead.name,
    company: lead.company ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    industry: lead.industry ?? "",
    leadScore: lead.lead_score,
    status: lead.status,
    leadSource: lead.lead_source,
  };
}

export function validateLeadForm(values: LeadFormValues): string | null {
  if (!values.name.trim()) {
    return "Lead name is required.";
  }

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}
