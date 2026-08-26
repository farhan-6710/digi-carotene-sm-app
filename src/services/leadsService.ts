import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  Lead,
  LeadNote,
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

export type UpdateLeadAddressInput = {
  address: string | null;
};

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

export async function fetchLeadById(leadId: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from(DB.LEADS.TABLE)
    .select(DB.LEADS.SELECT)
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Lead | null) ?? null;
}

/** Contact page = won leads (lead_score = 5). */
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

export async function updateLeadAddress(
  leadId: string,
  input: UpdateLeadAddressInput,
): Promise<Lead> {
  const address = input.address?.trim() || null;
  const { data, error } = await supabase
    .from(DB.LEADS.TABLE)
    .update({ address })
    .eq("id", leadId)
    .select(DB.LEADS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to update address.");
  }

  return data as Lead;
}

export async function deleteLead(leadId: string): Promise<void> {
  const { error } = await supabase.from(DB.LEADS.TABLE).delete().eq("id", leadId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete lead.");
  }
}

export async function fetchLeadNotes(leadId: string): Promise<LeadNote[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_NOTES.TABLE)
    .select(DB.LEAD_NOTES.SELECT)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LeadNote[];
}

export async function createLeadNote(
  leadId: string,
  body: string,
): Promise<LeadNote> {
  const nextBody = body.trim();
  if (!nextBody) {
    throw new Error("Note cannot be empty.");
  }

  const { data, error } = await supabase
    .from(DB.LEAD_NOTES.TABLE)
    .insert({ lead_id: leadId, body: nextBody })
    .select(DB.LEAD_NOTES.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to save note.");
  }

  return data as LeadNote;
}

export async function updateLeadNote(
  noteId: string,
  body: string,
): Promise<LeadNote> {
  const nextBody = body.trim();
  if (!nextBody) {
    throw new Error("Note cannot be empty.");
  }

  const { data, error } = await supabase
    .from(DB.LEAD_NOTES.TABLE)
    .update({ body: nextBody })
    .eq("id", noteId)
    .select(DB.LEAD_NOTES.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to update note.");
  }

  return data as LeadNote;
}

export async function deleteLeadNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.LEAD_NOTES.TABLE)
    .delete()
    .eq("id", noteId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete note.");
  }
}
