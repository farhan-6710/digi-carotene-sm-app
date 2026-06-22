import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/features/auth/types/profile";
import { isStaffRole } from "@/features/auth/types/profile";
import {
  fetchProfileByUserId,
  promoteProfileToStaff,
} from "@/features/auth/utils/profileRepository";
import { isTeamMemberEmail } from "@/features/auth/utils/teamRoleRepository";

/** Promotes to staff when the auth email matches a pre-added team_members row. */
export async function loadProfileForUser(user: User): Promise<Profile | null> {
  const profile = await fetchProfileByUserId(user.id);
  if (!profile || !user.email || isStaffRole(profile.role)) {
    return profile;
  }

  const onTeam = await isTeamMemberEmail(user.email);
  if (!onTeam) {
    return profile;
  }

  try {
    return await promoteProfileToStaff(user.id);
  } catch {
    return profile;
  }
}
