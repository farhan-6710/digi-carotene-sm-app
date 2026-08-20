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
  authorTeamMemberId: string;
  body: string;
}): Promise<TaskMessage> {
  const body = input.body.trim();
  if (!body) throw new Error("Message cannot be empty.");

  const { data, error } = await supabase
    .from(DB.TASK_MESSAGES.TABLE)
    .insert({
      task_id: input.taskId,
      author_team_member_id: input.authorTeamMemberId,
      body,
    })
    .select(DB.TASK_MESSAGES.SELECT)
    .single();

  if (error) throw error;
  return mapTaskMessageRow(data as unknown as TaskMessageRow);
}
