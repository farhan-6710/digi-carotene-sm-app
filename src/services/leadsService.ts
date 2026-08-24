import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  Lead,
  LeadScore,
  LeadSource,
  LeadStatus,
} from "@/features/crm/types/types";

export type CreateLeadInput = {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  leadScore: LeadScore;
  status: LeadStatus;
  leadSource: LeadSource;
};

export type UpdateLeadInput = CreateLeadInput;

function toLeadColumns(input: CreateLeadInput) {
  return {
    name: input.name.trim(),
    company: input.company?.trim() || null,
    email: input.email?.trim().toLowerCase() || null,
    phone: input.phone?.trim() || null,
    industry: input.industry?.trim() || null,
    lead_score: input.leadScore,
    status: input.status,
    lead_source: input.leadSource,
  };
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from(DB.LEADS.TABLE)
    .select(DB.LEADS.SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Lead[];
}

/** Contacts = leads that converted (lead_score = 5). */
export async function fetchConvertedLeads(
  convertedScore: LeadScore,
): Promise<Lead[]> {
  const { data, error } = await supabase
    .from(DB.LEADS.TABLE)
    .select(DB.LEADS.SELECT)
    .eq("lead_score", convertedScore)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Lead[];
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const { data, error } = await supabase
    .from(DB.LEADS.TABLE)
    .insert(toLeadColumns(input))
    .select(DB.LEADS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to create lead.");
  }

  return data as Lead;
}

export async function updateLead(
  leadId: string,
  input: UpdateLeadInput,
): Promise<Lead> {
  const { data, error } = await supabase
    .from(DB.LEADS.TABLE)
    .update(toLeadColumns(input))
    .eq("id", leadId)
    .select(DB.LEADS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to update lead.");
  }

  return data as Lead;
}

export async function deleteLead(leadId: string): Promise<void> {
  const { error } = await supabase.from(DB.LEADS.TABLE).delete().eq("id", leadId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete lead.");
  }
}
