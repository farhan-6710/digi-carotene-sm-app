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

export async function deleteTeamMember(memberId: string): Promise<void> {
  await resetProfilesForTeamMember(memberId).catch(() => {});

  const { error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .delete()
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete team member.");
  }
}
