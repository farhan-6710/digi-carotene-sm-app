import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  CreateTeamTodoInput,
  TeamTodo,
  UpdateTeamTodoInput,
} from "@/features/team-portal/types/types";

export async function fetchTeamTodosForMember(
  teamMemberId: string,
): Promise<TeamTodo[]> {
  const { data, error } = await supabase
    .from(DB.TEAM_TODOS.TABLE)
    .select(DB.TEAM_TODOS.SELECT)
    .eq("team_member_id", teamMemberId)
    .order("eta_date", { ascending: true })
    .order("eta_time", { ascending: true });

  if (error) throw error;
  return (data ?? []) as TeamTodo[];
}

export async function createTeamTodo(
  teamMemberId: string,
  input: CreateTeamTodoInput,
): Promise<TeamTodo> {
  const title = input.title.trim();
  if (!title) throw new Error("To-do title is required.");

  const { data, error } = await supabase
    .from(DB.TEAM_TODOS.TABLE)
    .insert({
      team_member_id: teamMemberId,
      title,
      description: input.description?.trim() || null,
      eta_date: input.etaDate,
      eta_time: input.etaTime,
      status: input.status,
    })
    .select(DB.TEAM_TODOS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create to-do.");
  return data as TeamTodo;
}

export async function updateTeamTodo(
  todoId: string,
  input: UpdateTeamTodoInput,
): Promise<TeamTodo> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("To-do title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.etaDate !== undefined) cols.eta_date = input.etaDate;
  if (input.etaTime !== undefined) cols.eta_time = input.etaTime;
  if (input.status !== undefined) cols.status = input.status;

  const { data, error } = await supabase
    .from(DB.TEAM_TODOS.TABLE)
    .update(cols)
    .eq("id", todoId)
    .select(DB.TEAM_TODOS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update to-do.");
  return data as TeamTodo;
}

export async function deleteTeamTodo(todoId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.TEAM_TODOS.TABLE)
    .delete()
    .eq("id", todoId);

  if (error) throw new Error(error.message ?? "Failed to delete to-do.");
}
