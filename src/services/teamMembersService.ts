import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import {
  linkProfileByEmail,
  resetProfilesForTeamMember,
} from "@/services/profilesService";
import {
  isProjectManagerRole,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMember } from "@/features/team-management/types/types";
import { mapDbRowToTeamMember } from "@/features/team-management/utils/teamMemberDb";

export type CreateTeamMemberInput = {
  memberName: string;
  email: string;
  mobileNumber?: string | null;
  teamRole: TeamMemberRole;
};

export type UpdateTeamMemberInput = CreateTeamMemberInput;

function saveError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("A team member with this email already exists.");
  }
  return new Error(error.message ?? "Failed to save team member.");
}

function toTeamMemberColumns(input: CreateTeamMemberInput) {
  return {
    member_name: input.memberName,
    email: input.email.trim().toLowerCase(),
    mobile_number: input.mobileNumber || null,
    team_role: input.teamRole,
  };
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select(DB.TEAM_MEMBERS.SELECT)
    .order("member_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapDbRowToTeamMember(row));
}

export async function fetchTeamMemberById(
  memberId: string,
): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select(DB.TEAM_MEMBERS.SELECT)
    .eq("id", memberId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapDbRowToTeamMember(data) : null;
}

export async function fetchTeamMembersByIds(
  memberIds: string[],
): Promise<TeamMember[]> {
  if (memberIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select(DB.TEAM_MEMBERS.SELECT)
    .in("id", memberIds);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapDbRowToTeamMember(row));
}

export async function fetchProjectManagers(): Promise<TeamMember[]> {
  const members = await fetchTeamMembers();
  return members.filter((member) => isProjectManagerRole(member.team_role));
}

export async function fetchAdminTeamMembers(): Promise<
  Pick<TeamMember, "id" | "member_name">[]
> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select("id, member_name")
    .eq("team_role", "admin")
    .order("member_name", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    member_name: row.member_name,
  }));
}

/** Ensures every admin is included in project extra-team assignments. */
export async function withAdminTeamMemberIds(
  teamMemberIds: string[],
): Promise<string[]> {
  const admins = await fetchAdminTeamMembers();
  return [...new Set([...teamMemberIds, ...admins.map((admin) => admin.id)])];
}

export async function createTeamMember(
  input: CreateTeamMemberInput,
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .insert(toTeamMemberColumns(input))
    .select(DB.TEAM_MEMBERS.SELECT)
    .single();

  if (error) {
    throw saveError(error);
  }

  await linkProfileByEmail(input.email).catch(() => {});

  return mapDbRowToTeamMember(data);
}

export async function updateTeamMember(
  memberId: string,
  input: UpdateTeamMemberInput,
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .update(toTeamMemberColumns(input))
    .eq("id", memberId)
    .select(DB.TEAM_MEMBERS.SELECT)
    .single();

  if (error) {
    throw saveError(error);
  }

  await linkProfileByEmail(input.email).catch(() => {});

  return mapDbRowToTeamMember(data);
}

/** Thrown when delete is blocked by project / task / plan links. */
export class TeamMemberStillLinkedError extends Error {
  readonly code = "TEAM_MEMBER_STILL_LINKED";

  constructor() {
    super(
      "This team member is still linked to projects, tasks, or plans. Reassign or remove those first.",
    );
    this.name = "TeamMemberStillLinkedError";
  }
}

export function isTeamMemberStillLinkedError(
  error: unknown,
): error is TeamMemberStillLinkedError {
  return error instanceof TeamMemberStillLinkedError;
}

type DeleteTeamMemberOptions = {
  /** End assignments, hand off ownership, then delete. */
  force?: boolean;
};

async function fetchFallbackTeamMemberId(excludeId: string): Promise<string> {
  const admins = await fetchAdminTeamMembers();
  const otherAdmin = admins.find((admin) => admin.id !== excludeId);
  if (otherAdmin) return otherAdmin.id;

  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select("id")
    .neq("id", excludeId)
    .order("member_name", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message ?? "Failed to find a replacement team member.");
  }
  if (!data?.id) {
    throw new Error(
      "Add another team member first so ownership can be reassigned.",
    );
  }
  return data.id;
}

async function runUpdate(
  table: string,
  values: Record<string, unknown>,
  column: string,
  memberId: string,
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .update(values)
    .eq(column, memberId);
  if (error) {
    throw new Error(error.message ?? `Failed to update ${table}.`);
  }
}

async function runDelete(
  table: string,
  column: string,
  memberId: string,
): Promise<void> {
  const { error } = await supabase.from(table).delete().eq(column, memberId);
  if (error) {
    throw new Error(error.message ?? `Failed to clear ${table}.`);
  }
}

/** End seats, deactivate managed work, reassign required FKs to another member. */
async function endTeamMemberAssignments(memberId: string): Promise<void> {
  const fallbackId = await fetchFallbackTeamMemberId(memberId);
  const endedAt = new Date().toISOString();

  for (const table of [
    DB.PROJECT_TEAM_MEMBERS.TABLE,
    DB.DEV_PROJECT_TEAM_MEMBERS.TABLE,
    DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE,
    DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE,
  ]) {
    const { error } = await supabase
      .from(table)
      .update({ ended_at: endedAt })
      .eq("member_id", memberId)
      .is("ended_at", null);
    if (error) {
      throw new Error(error.message ?? `Failed to end assignments on ${table}.`);
    }
  }

  for (const table of [
    DB.PROJECTS.TABLE,
    DB.DEV_PROJECTS.TABLE,
    DB.OTHER_PROJECTS.TABLE,
  ]) {
    await runUpdate(
      table,
      { is_active: false, manager_id: fallbackId },
      "manager_id",
      memberId,
    );
  }

  await runUpdate(
    DB.PRODUCTION_PLANS.TABLE,
    { manager_id: fallbackId },
    "manager_id",
    memberId,
  );
  await runUpdate(
    DB.PRODUCTION_PLANS.TABLE,
    { shoot_incharge_id: null },
    "shoot_incharge_id",
    memberId,
  );

  await runUpdate(
    DB.TASKS.TABLE,
    { status: "completed", assigned_to_team_member_id: fallbackId },
    "assigned_to_team_member_id",
    memberId,
  );
  await runUpdate(
    DB.TASKS.TABLE,
    { created_by_team_member_id: fallbackId },
    "created_by_team_member_id",
    memberId,
  );

  await runUpdate(
    DB.SUBTASKS.TABLE,
    { status: "completed", assigned_to_team_member_id: fallbackId },
    "assigned_to_team_member_id",
    memberId,
  );
  await runUpdate(
    DB.SUBTASKS.TABLE,
    { created_by_team_member_id: fallbackId },
    "created_by_team_member_id",
    memberId,
  );

  await runDelete(DB.TASK_ASSIGNEES.TABLE, "team_member_id", memberId);
  await runDelete(DB.SUBTASK_ASSIGNEES.TABLE, "team_member_id", memberId);
  await runDelete(DB.TASK_MESSAGES.TABLE, "author_team_member_id", memberId);
  await runDelete(DB.PROJECT_MESSAGES.TABLE, "author_team_member_id", memberId);
  await runDelete(
    DB.POST_APPROVAL_REQUESTS.TABLE,
    "requested_by_team_member_id",
    memberId,
  );
}

export async function deleteTeamMember(
  memberId: string,
  options: DeleteTeamMemberOptions = {},
): Promise<void> {
  await resetProfilesForTeamMember(memberId).catch(() => {});

  if (options.force) {
    await endTeamMemberAssignments(memberId);
  } else {
    // Approval requests used ON DELETE RESTRICT; remove this member's rows first
    // (migration 085 also cascades for future deletes).
    await runDelete(
      DB.POST_APPROVAL_REQUESTS.TABLE,
      "requested_by_team_member_id",
      memberId,
    );
  }

  const { error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .delete()
    .eq("id", memberId);

  if (error) {
    if (error.code === "23503") {
      throw new TeamMemberStillLinkedError();
    }
    throw new Error(error.message ?? "Failed to delete team member.");
  }
}

export async function deleteTeamMembersByIds(ids: string[]): Promise<void> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return;
  for (const id of unique) {
    await deleteTeamMember(id);
  }
}
