import type { TaskMessage } from "@/features/tasks-management/types/types";
import {
  mapTaskMessageRow,
  type TaskMessageRow,
} from "@/features/tasks-management/utils/taskMessageDb";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export async function fetchTaskMessages(
  taskId: string,
): Promise<TaskMessage[]> {
  const { data, error } = await supabase
    .from(DB.TASK_MESSAGES.TABLE)
    .select(DB.TASK_MESSAGES.SELECT)
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapTaskMessageRow(row as unknown as TaskMessageRow),
  );
}

export async function createTaskMessage(input: {
  taskId: string;
  authorTeamMemberId?: string | null;
  authorClientId?: string | null;
  body: string;
  mentionedTeamMemberIds?: string[];
  mentionedClientIds?: string[];
}): Promise<TaskMessage> {
  const body = input.body.trim();
  if (!body) throw new Error("Message cannot be empty.");

  const authorTeamMemberId = input.authorTeamMemberId?.trim() || null;
  const authorClientId = input.authorClientId?.trim() || null;
  if (Boolean(authorTeamMemberId) === Boolean(authorClientId)) {
    throw new Error("Message needs exactly one author (teammate or client).");
  }

  const { data, error } = await supabase
    .from(DB.TASK_MESSAGES.TABLE)
    .insert({
      task_id: input.taskId,
      author_team_member_id: authorTeamMemberId,
      author_client_id: authorClientId,
      body,
      mentioned_team_member_ids: input.mentionedTeamMemberIds ?? [],
      mentioned_client_ids: input.mentionedClientIds ?? [],
    })
    .select(DB.TASK_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapTaskMessageRow(data as unknown as TaskMessageRow);
}

export async function updateTaskMessage(
  messageId: string,
  body: string,
  mentions?: {
    mentionedTeamMemberIds: string[];
    mentionedClientIds: string[];
  },
): Promise<TaskMessage> {
  const nextBody = body.trim();
  if (!nextBody) throw new Error("Message cannot be empty.");

  const patch: Record<string, unknown> = { body: nextBody };
  if (mentions) {
    patch.mentioned_team_member_ids = mentions.mentionedTeamMemberIds;
    patch.mentioned_client_ids = mentions.mentionedClientIds;
  }

  const { data, error } = await supabase
    .from(DB.TASK_MESSAGES.TABLE)
    .update(patch)
    .eq("id", messageId)
    .select(DB.TASK_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapTaskMessageRow(data as unknown as TaskMessageRow);
}

export async function deleteTaskMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.TASK_MESSAGES.TABLE)
    .delete()
    .eq("id", messageId);

  if (error) throw error;
}
