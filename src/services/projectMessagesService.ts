import type { ProjectMessage } from "@/features/chat/types/projectMessage";
import { mapProjectMessageRow, type ProjectMessageRow } from "@/features/chat/utils/projectMessageDb";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export async function fetchProjectMessages(
  smProjectId: string,
): Promise<ProjectMessage[]> {
  const { data, error } = await supabase
    .from(DB.PROJECT_MESSAGES.TABLE)
    .select(DB.PROJECT_MESSAGES.SELECT)
    .eq("sm_project_id", smProjectId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapProjectMessageRow(row as unknown as ProjectMessageRow),
  );
}

export async function createProjectMessage(input: {
  smProjectId: string;
  authorTeamMemberId?: string | null;
  authorClientId?: string | null;
  body: string;
  mentionedTeamMemberIds?: string[];
  mentionedClientIds?: string[];
}): Promise<ProjectMessage> {
  const body = input.body.trim();
  if (!body) throw new Error("Message cannot be empty.");

  const authorTeamMemberId = input.authorTeamMemberId?.trim() || null;
  const authorClientId = input.authorClientId?.trim() || null;
  if (Boolean(authorTeamMemberId) === Boolean(authorClientId)) {
    throw new Error("Message needs exactly one author (teammate or client).");
  }

  const { data, error } = await supabase
    .from(DB.PROJECT_MESSAGES.TABLE)
    .insert({
      sm_project_id: input.smProjectId,
      author_team_member_id: authorTeamMemberId,
      author_client_id: authorClientId,
      body,
      mentioned_team_member_ids: input.mentionedTeamMemberIds ?? [],
      mentioned_client_ids: input.mentionedClientIds ?? [],
    })
    .select(DB.PROJECT_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapProjectMessageRow(data as unknown as ProjectMessageRow);
}

export async function updateProjectMessage(
  messageId: string,
  body: string,
  mentions?: {
    mentionedTeamMemberIds: string[];
    mentionedClientIds: string[];
  },
): Promise<ProjectMessage> {
  const nextBody = body.trim();
  if (!nextBody) throw new Error("Message cannot be empty.");

  const patch: Record<string, unknown> = { body: nextBody };
  if (mentions) {
    patch.mentioned_team_member_ids = mentions.mentionedTeamMemberIds;
    patch.mentioned_client_ids = mentions.mentionedClientIds;
  }

  const { data, error } = await supabase
    .from(DB.PROJECT_MESSAGES.TABLE)
    .update(patch)
    .eq("id", messageId)
    .select(DB.PROJECT_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapProjectMessageRow(data as unknown as ProjectMessageRow);
}

export async function deleteProjectMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROJECT_MESSAGES.TABLE)
    .delete()
    .eq("id", messageId);

  if (error) throw error;
}
