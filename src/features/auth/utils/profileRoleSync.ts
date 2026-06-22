import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/features/auth/types/profile";
import { fetchProfileByUserId } from "@/features/auth/utils/profileRepository";

/** Loads the auth user's profile. Portal access requires linked ids (see isPendingAccess). */
export async function loadProfileForUser(user: User): Promise<Profile | null> {
  return fetchProfileByUserId(user.id);
}
