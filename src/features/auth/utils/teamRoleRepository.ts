import { supabase } from "@/shared/lib/supabase";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export async function isTeamMemberEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_team_member_email", {
    lookup_email: email.trim(),
  });

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function fetchTeamRoleByMemberId(
  teamMemberId: string,
): Promise<TeamMemberRole | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_role")
    .eq("id", teamMemberId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.team_role as TeamMemberRole;
}
