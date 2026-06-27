import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Profile } from "@/features/auth/types/profile";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

// Reads the profile row that links an auth user to a portal.
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from(DB.PROFILES.TABLE)
    .select(DB.PROFILES.SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Profile | null) ?? null;
}

// Reads the role of a team member (admin, manager, executive, etc.).
export async function fetchTeamRole(
  teamMemberId: string,
): Promise<TeamMemberRole | null> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select("team_role")
    .eq("id", teamMemberId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.team_role as TeamMemberRole;
}

// Asks the database to link an auth user to a roster row by matching email.
export async function linkProfileByEmail(email: string): Promise<void> {
  const lookupEmail = email.trim().toLowerCase();
  if (!lookupEmail) {
    return;
  }

  const { error } = await supabase.rpc("link_profile_by_email", {
    lookup_email: lookupEmail,
  });

  if (error) {
    throw error;
  }
}

// Resets profiles back to a plain user when their team member row is removed.
export async function resetProfilesForTeamMember(
  teamMemberId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.PROFILES.TABLE)
    .update({ role: "user", team_member_id: null })
    .eq("team_member_id", teamMemberId);

  if (error) {
    throw error;
  }
}

// Resets profiles back to a plain user when their client row is removed.
export async function resetProfilesForClient(clientId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROFILES.TABLE)
    .update({ role: "user", client_id: null })
    .eq("client_id", clientId);

  if (error) {
    throw error;
  }
}
