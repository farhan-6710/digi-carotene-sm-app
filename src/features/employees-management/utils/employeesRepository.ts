import type { EmployeeRole } from "@/features/employees-management/constants/employeeRoles";
import type { TeamMember } from "@/features/employees-management/types/types";
import {
  mapDbRowToTeamMember,
  resolveTeamMemberDbSchema,
} from "@/features/employees-management/utils/teamMemberDb";
import { supabase } from "@/shared/lib/supabase";

function formatTeamMemberError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("A team member with this email already exists.");
  }

  return new Error(error.message ?? "Failed to save team member.");
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.membersTable)
    .select("*")
    .order(schema.memberNameColumn, { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    mapDbRowToTeamMember(row, schema.memberNameColumn),
  );
}

export async function fetchTeamMemberById(memberId: string): Promise<TeamMember | null> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.membersTable)
    .select("*")
    .eq("id", memberId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDbRowToTeamMember(data, schema.memberNameColumn);
}

export type CreateTeamMemberInput = {
  memberName: string;
  email: string;
  mobileNumber?: string | null;
  role: EmployeeRole;
};

export type UpdateTeamMemberInput = CreateTeamMemberInput;

export async function createTeamMember(input: CreateTeamMemberInput): Promise<TeamMember> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.membersTable)
    .insert({
      [schema.memberNameColumn]: input.memberName,
      email: input.email.trim().toLowerCase(),
      mobile_number: input.mobileNumber || null,
      role: input.role,
    })
    .select("*")
    .single();

  if (error) {
    throw formatTeamMemberError(error);
  }

  return mapDbRowToTeamMember(data, schema.memberNameColumn);
}

export async function updateTeamMember(
  memberId: string,
  input: UpdateTeamMemberInput,
): Promise<TeamMember> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.membersTable)
    .update({
      [schema.memberNameColumn]: input.memberName,
      email: input.email.trim().toLowerCase(),
      mobile_number: input.mobileNumber || null,
      role: input.role,
    })
    .eq("id", memberId)
    .select("*")
    .single();

  if (error) {
    throw formatTeamMemberError(error);
  }

  return mapDbRowToTeamMember(data, schema.memberNameColumn);
}

export async function deleteTeamMember(memberId: string): Promise<void> {
  const schema = await resolveTeamMemberDbSchema();

  const { error } = await supabase
    .from(schema.membersTable)
    .delete()
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message ?? "Failed to delete team member.");
  }
}
