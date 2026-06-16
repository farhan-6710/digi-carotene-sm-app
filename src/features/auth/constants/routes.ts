import type { UserRole } from "@/features/auth/types/profile";
import { isAdminRole, isClientRole } from "@/features/auth/types/profile";

export const ADMIN_HOME = "/admin/dashboard";
export const PORTAL_HOME = "/portal/dashboard";

export function getHomePathForRole(role: UserRole): string {
  if (isClientRole(role)) {
    return PORTAL_HOME;
  }

  if (isAdminRole(role)) {
    return ADMIN_HOME;
  }

  return ADMIN_HOME;
}

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

export function isPortalPath(pathname: string): boolean {
  return pathname.startsWith("/portal");
}
