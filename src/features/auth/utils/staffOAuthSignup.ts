import type { User } from "@supabase/supabase-js";

import {
  STAFF_OAUTH_SIGNUP_SESSION_KEY,
  STAFF_OAUTH_SIGNUP_TTL_MS,
} from "@/features/auth/constants/auth";
import type { Profile } from "@/features/auth/types/profile";
import {
  fetchProfileByUserId,
  promoteProfileToStaff,
} from "@/features/auth/utils/profileRepository";

/** How long after account creation we treat a Google sign-in as a new signup. */
const NEW_AUTH_USER_WINDOW_MS = 2 * 60 * 1000;

export function markPendingStaffOAuthSignup(): void {
  sessionStorage.setItem(STAFF_OAUTH_SIGNUP_SESSION_KEY, String(Date.now()));
}

function clearPendingStaffOAuthSignup(): void {
  sessionStorage.removeItem(STAFF_OAUTH_SIGNUP_SESSION_KEY);
}

function hasFreshStaffOAuthIntent(): boolean {
  const raw = sessionStorage.getItem(STAFF_OAUTH_SIGNUP_SESSION_KEY);
  if (!raw) {
    return false;
  }

  const startedAt = Number(raw);
  if (!Number.isFinite(startedAt)) {
    return false;
  }

  return Date.now() - startedAt <= STAFF_OAUTH_SIGNUP_TTL_MS;
}

export function isNewAuthUser(user: User): boolean {
  const createdAt = new Date(user.created_at).getTime();
  return Date.now() - createdAt <= NEW_AUTH_USER_WINDOW_MS;
}

/**
 * After Google OAuth on the staff signup page:
 * - New account + client profile → promote to staff
 * - Existing account → keep current role (sign-in only)
 * - Already staff → no-op
 */
export async function resolveProfileAfterStaffOAuth(
  user: User,
  profile: Profile | null,
): Promise<Profile | null> {
  const pendingStaffOAuth = hasFreshStaffOAuthIntent();
  clearPendingStaffOAuthSignup();

  if (!pendingStaffOAuth || !profile) {
    return profile;
  }

  if (profile.role === "staff") {
    return profile;
  }

  if (profile.role === "client" && isNewAuthUser(user)) {
    try {
      return await promoteProfileToStaff(user.id);
    } catch {
      return profile;
    }
  }

  return profile;
}

export async function loadProfileForUser(user: User): Promise<Profile | null> {
  const profile = await fetchProfileByUserId(user.id);
  return resolveProfileAfterStaffOAuth(user, profile);
}
