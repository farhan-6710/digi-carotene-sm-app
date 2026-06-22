import type { Profile } from "@/features/auth/types/profile";
import {
  hasClientPortalAccess,
  hasStaffPortalAccess,
} from "@/features/auth/types/profile";

export const STAFF_HOME = "/staff-portal/dashboard";
export const CLIENT_HOME = "/client-portal/dashboard";
export const USER_HOME = "/user-portal";

export function getHomePathForProfile(profile: Profile | null): string {
  if (!profile) {
    return USER_HOME;
  }

  if (hasStaffPortalAccess(profile)) {
    return STAFF_HOME;
  }

  if (hasClientPortalAccess(profile)) {
    return CLIENT_HOME;
  }

  return USER_HOME;
}

export function isStaffPath(pathname: string): boolean {
  return pathname.startsWith("/staff-portal");
}

export function isClientPath(pathname: string): boolean {
  return pathname.startsWith("/client-portal");
}

export function isUserPath(pathname: string): boolean {
  return pathname.startsWith("/user-portal");
}
