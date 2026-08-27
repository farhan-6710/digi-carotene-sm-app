import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  CreateLeadAttachmentInput,
  CreateLeadCallInput,
  CreateLeadMeetingInput,
  CreateLeadTaskInput,
  LeadAttachment,
  LeadCall,
  LeadMeeting,
  LeadTask,
  UpdateLeadCallInput,
  UpdateLeadMeetingInput,
  UpdateLeadTaskInput,
} from "@/features/crm/types/types";

export async function fetchLeadAttachments(
  leadId: string,
): Promise<LeadAttachment[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_ATTACHMENTS.TABLE)
    .select(DB.LEAD_ATTACHMENTS.SELECT)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LeadAttachment[];
}

export async function createLeadAttachment(
  leadId: string,
  input: CreateLeadAttachmentInput,
): Promise<LeadAttachment> {
  const url = input.url.trim();
  if (!url) throw new Error("Attachment link is required.");

  const label = input.label?.trim() || null;

  const { data, error } = await supabase
    .from(DB.LEAD_ATTACHMENTS.TABLE)
    .insert({ lead_id: leadId, url, label })
    .select(DB.LEAD_ATTACHMENTS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to add attachment.");
  return data as LeadAttachment;
}

export async function deleteLeadAttachment(
  attachmentId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.LEAD_ATTACHMENTS.TABLE)
    .delete()
    .eq("id", attachmentId);

  if (error) throw new Error(error.message ?? "Failed to delete attachment.");
}

export async function fetchLeadTasks(leadId: string): Promise<LeadTask[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_TASKS.TABLE)
    .select(DB.LEAD_TASKS.SELECT)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LeadTask[];
}

export async function createLeadTask(
  leadId: string,
  input: CreateLeadTaskInput,
): Promise<LeadTask> {
  const title = input.title.trim();
  if (!title) throw new Error("Task title is required.");

  const { data, error } = await supabase
    .from(DB.LEAD_TASKS.TABLE)
    .insert({
      lead_id: leadId,
      title,
      description: input.description?.trim() || null,
      priority: input.priority,
      status: input.status,
      eta_date: input.etaDate,
      eta_time: input.etaTime,
    })
    .select(DB.LEAD_TASKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create task.");
  return data as LeadTask;
}

export async function updateLeadTask(
  taskId: string,
  input: UpdateLeadTaskInput,
): Promise<LeadTask> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Task title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.priority !== undefined) cols.priority = input.priority;
  if (input.status !== undefined) cols.status = input.status;
  if (input.etaDate !== undefined) cols.eta_date = input.etaDate;
  if (input.etaTime !== undefined) cols.eta_time = input.etaTime;

  const { data, error } = await supabase
    .from(DB.LEAD_TASKS.TABLE)
    .update(cols)
    .eq("id", taskId)
    .select(DB.LEAD_TASKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update task.");
  return data as LeadTask;
}

export async function deleteLeadTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.LEAD_TASKS.TABLE)
    .delete()
    .eq("id", taskId);

  if (error) throw new Error(error.message ?? "Failed to delete task.");
}

export async function fetchLeadMeetings(
  leadId: string,
): Promise<LeadMeeting[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_MEETINGS.TABLE)
    .select(DB.LEAD_MEETINGS.SELECT)
    .eq("lead_id", leadId)
    .order("from_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as LeadMeeting[];
}

export async function createLeadMeeting(
  leadId: string,
  input: CreateLeadMeetingInput,
): Promise<LeadMeeting> {
  const title = input.title.trim();
  if (!title) throw new Error("Meeting title is required.");

  const { data, error } = await supabase
    .from(DB.LEAD_MEETINGS.TABLE)
    .insert({
      lead_id: leadId,
      title,
      description: input.description?.trim() || null,
      status: input.status,
      from_date: input.fromDate,
      from_time: input.fromTime,
      to_date: input.toDate,
      to_time: input.toTime,
      venue: input.venue,
    })
    .select(DB.LEAD_MEETINGS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create meeting.");
  return data as LeadMeeting;
}

export async function updateLeadMeeting(
  meetingId: string,
  input: UpdateLeadMeetingInput,
): Promise<LeadMeeting> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Meeting title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.status !== undefined) cols.status = input.status;
  if (input.fromDate !== undefined) cols.from_date = input.fromDate;
  if (input.fromTime !== undefined) cols.from_time = input.fromTime;
  if (input.toDate !== undefined) cols.to_date = input.toDate;
  if (input.toTime !== undefined) cols.to_time = input.toTime;
  if (input.venue !== undefined) cols.venue = input.venue;

  const { data, error } = await supabase
    .from(DB.LEAD_MEETINGS.TABLE)
    .update(cols)
    .eq("id", meetingId)
    .select(DB.LEAD_MEETINGS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update meeting.");
  return data as LeadMeeting;
}

export async function deleteLeadMeeting(meetingId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.LEAD_MEETINGS.TABLE)
    .delete()
    .eq("id", meetingId);

  if (error) throw new Error(error.message ?? "Failed to delete meeting.");
}

export async function fetchLeadCalls(leadId: string): Promise<LeadCall[]> {
  const { data, error } = await supabase
    .from(DB.LEAD_CALLS.TABLE)
    .select(DB.LEAD_CALLS.SELECT)
    .eq("lead_id", leadId)
    .order("start_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as LeadCall[];
}

export async function createLeadCall(
  leadId: string,
  input: CreateLeadCallInput,
): Promise<LeadCall> {
  const title = input.title.trim();
  if (!title) throw new Error("Call title is required.");
  if (input.durationMinutes <= 0) {
    throw new Error("Call duration must be greater than zero.");
  }

  const { data, error } = await supabase
    .from(DB.LEAD_CALLS.TABLE)
    .insert({
      lead_id: leadId,
      title,
      description: input.description?.trim() || null,
      status: input.status,
      start_date: input.startDate,
      start_time: input.startTime,
      duration_minutes: input.durationMinutes,
    })
    .select(DB.LEAD_CALLS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create call.");
  return data as LeadCall;
}

export async function updateLeadCall(
  callId: string,
  input: UpdateLeadCallInput,
): Promise<LeadCall> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Call title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.status !== undefined) cols.status = input.status;
  if (input.startDate !== undefined) cols.start_date = input.startDate;
  if (input.startTime !== undefined) cols.start_time = input.startTime;
  if (input.durationMinutes !== undefined) {
    if (input.durationMinutes <= 0) {
      throw new Error("Call duration must be greater than zero.");
    }
    cols.duration_minutes = input.durationMinutes;
  }

  const { data, error } = await supabase
    .from(DB.LEAD_CALLS.TABLE)
    .update(cols)
    .eq("id", callId)
    .select(DB.LEAD_CALLS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update call.");
  return data as LeadCall;
}

export async function deleteLeadCall(callId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.LEAD_CALLS.TABLE)
    .delete()
    .eq("id", callId);

  if (error) throw new Error(error.message ?? "Failed to delete call.");
}
