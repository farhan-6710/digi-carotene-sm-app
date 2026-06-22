import { supabase } from "@/shared/lib/supabase";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

// Resolves the logged-in user's internal team role by matching their auth
// email to a `team_members` row. Returns null when the user is not on the team.
export async function fetchTeamRoleByEmail(
  email: string,
): Promise<TeamMemberRole | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("admin_team_role")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.admin_team_role as TeamMemberRole;
}
