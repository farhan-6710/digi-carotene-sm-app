import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/features/auth/types/profile";
import { supabase } from "@/shared/lib/supabase";

function normalizePortalEmail(email: string): string {
  return email.trim().toLowerCase();
}

type ProfileAccessPatch = {
  role: Profile["role"];
  team_member_id: string | null;
  client_id: string | null;
};

function isProfileAccessAligned(
  profile: Profile,
  patch: ProfileAccessPatch,
): boolean {
  return (
    profile.role === patch.role &&
    profile.team_member_id === patch.team_member_id &&
    profile.client_id === patch.client_id
  );
}

async function findTeamMemberIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function findClientIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function applyProfileAccessPatch(
  userId: string,
  patch: ProfileAccessPatch,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("id, role, client_id, team_member_id")
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}

/** Match signed-in user email to roster rows and update own profile when out of sync. */
export async function syncProfileAccessForUser(
  user: User,
  profile: Profile,
): Promise<Profile> {
  const email = user.email ? normalizePortalEmail(user.email) : null;
  if (!email) {
    return profile;
  }

  const teamMemberId = await findTeamMemberIdByEmail(email);
  if (teamMemberId) {
    const patch: ProfileAccessPatch = {
      role: "team",
      team_member_id: teamMemberId,
      client_id: null,
    };

    if (isProfileAccessAligned(profile, patch)) {
      return profile;
    }

    return applyProfileAccessPatch(profile.id, patch);
  }

  const clientId = await findClientIdByEmail(email);
  if (clientId) {
    const patch: ProfileAccessPatch = {
      role: "client",
      client_id: clientId,
      team_member_id: null,
    };

    if (isProfileAccessAligned(profile, patch)) {
      return profile;
    }

    return applyProfileAccessPatch(profile.id, patch);
  }

  return profile;
}
