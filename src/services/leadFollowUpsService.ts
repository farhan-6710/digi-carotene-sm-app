import type {
  CreateLeadFollowUpInput,
  LeadFollowUp,
  UpdateLeadFollowUpInput,
} from "@/features/crm/types/types";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export async function fetchAllLeadFollowUps(): Promise<LeadFollowUp[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_FOLLOW_UPS.TABLE)
    .select(DB.LEAD_FOLLOW_UPS.SELECT)
    .order("follow_up_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as LeadFollowUp[];
}

export async function fetchLeadFollowUps(
  leadId: string,
): Promise<LeadFollowUp[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_FOLLOW_UPS.TABLE)
    .select(DB.LEAD_FOLLOW_UPS.SELECT)
    .eq("lead_id", leadId)
    .order("follow_up_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as LeadFollowUp[];
}

export async function createLeadFollowUp(
  leadId: string,
  input: CreateLeadFollowUpInput,
): Promise<LeadFollowUp> {
  if (!input.followUpDate) throw new Error("Follow-up date is required.");

  const { data, error } = await supabase
    .from(DB.LEAD_FOLLOW_UPS.TABLE)
    .insert({
      lead_id: leadId,
      follow_up_date: input.followUpDate,
      follow_up_time: input.followUpTime ?? "",
      status: input.status,
      note: input.note?.trim() || null,
    })
    .select(DB.LEAD_FOLLOW_UPS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create follow-up.");
  return data as LeadFollowUp;
}

export async function updateLeadFollowUp(
  followUpId: string,
  input: UpdateLeadFollowUpInput,
): Promise<LeadFollowUp> {
  const cols: Record<string, unknown> = {};
  if (input.followUpDate !== undefined) {
    if (!input.followUpDate) throw new Error("Follow-up date is required.");
    cols.follow_up_date = input.followUpDate;
  }
  if (input.followUpTime !== undefined) {
    cols.follow_up_time = input.followUpTime ?? "";
  }
  if (input.status !== undefined) cols.status = input.status;
  if (input.note !== undefined) cols.note = input.note?.trim() || null;

  const { data, error } = await supabase
    .from(DB.LEAD_FOLLOW_UPS.TABLE)
    .update(cols)
    .eq("id", followUpId)
    .select(DB.LEAD_FOLLOW_UPS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update follow-up.");
  return data as LeadFollowUp;
}

export async function deleteLeadFollowUp(followUpId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.LEAD_FOLLOW_UPS.TABLE)
    .delete()
    .eq("id", followUpId);

  if (error) throw new Error(error.message ?? "Failed to delete follow-up.");
}
