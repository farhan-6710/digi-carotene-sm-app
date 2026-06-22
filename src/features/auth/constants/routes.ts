import type { Profile } from "@/features/auth/types/profile";
import { isClientRole, isStaffRole } from "@/features/auth/types/profile";

export const STAFF_HOME = "/staff-portal/dashboard";
export const CLIENT_HOME = "/client-portal/dashboard";
export const USER_HOME = "/user-portal";

export function getHomePathForProfile(profile: Profile | null): string {
  if (!profile) {
    return USER_HOME;
  }

  if (isStaffRole(profile.role)) {
    return STAFF_HOME;
  }

  if (isClientRole(profile.role) && profile.client_id) {
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
