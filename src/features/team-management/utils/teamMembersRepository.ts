import {
  isProjectManagerRole,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMember } from "@/features/team-management/types/types";
import { mapDbRowToTeamMember } from "@/features/team-management/utils/teamMemberDb";
import { resetProfilesForTeamMember } from "@/features/auth/utils/profileRepository";
import { supabase } from "@/shared/lib/supabase";

function formatTeamMemberError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("A team member with this email already exists.");
  }

  return new Error(error.message ?? "Failed to save team member.");
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("member_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapDbRowToTeamMember(row));
}

export async function fetchTeamMemberById(memberId: string): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDbRowToTeamMember(data);
}

export type CreateTeamMemberInput = {
  memberName: string;
  email: string;
  mobileNumber?: string | null;
  teamRole: TeamMemberRole;
};

export type UpdateTeamMemberInput = CreateTeamMemberInput;

export async function createTeamMember(
  input: CreateTeamMemberInput,
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .insert({
      member_name: input.memberName,
      email: input.email.trim().toLowerCase(),
      mobile_number: input.mobileNumber || null,
      team_role: input.teamRole,
    })
    .select("*")
    .single();

  if (error) {
    throw formatTeamMemberError(error);
  }

  return mapDbRowToTeamMember(data);
}

export async function updateTeamMember(
  memberId: string,
  input: UpdateTeamMemberInput,
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .update({
      member_name: input.memberName,
      email: input.email.trim().toLowerCase(),
      mobile_number: input.mobileNumber || null,
      team_role: input.teamRole,
    })
    .eq("id", memberId)
    .select("*")
    .single();

  if (error) {
    throw formatTeamMemberError(error);
  }

  return mapDbRowToTeamMember(data);
}

export async function deleteTeamMember(memberId: string): Promise<void> {
  try {
    await resetProfilesForTeamMember(memberId);
  } catch {
    // DB trigger also resets profiles; continue with delete.
  }

  const { error } = await supabase.from("team_members").delete().eq("id", memberId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete team member.");
  }
}

export async function fetchProjectManagers(): Promise<TeamMember[]> {
  const members = await fetchTeamMembers();
  return members.filter((member) => isProjectManagerRole(member.team_role));
}
