export type UserRole = "staff" | "client" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
  team_member_id: string | null;
};

export function isStaffRole(role: UserRole): boolean {
  return role === "staff";
}

export function isClientRole(role: UserRole): boolean {
  return role === "client";
}

export function isUserRole(role: UserRole): boolean {
  return role === "user";
}

export function hasStaffPortalAccess(profile: Profile | null): boolean {
  return (
    profile !== null &&
    isStaffRole(profile.role) &&
    profile.team_member_id !== null
  );
}

export function hasClientPortalAccess(profile: Profile | null): boolean {
  return (
    profile !== null &&
    isClientRole(profile.role) &&
    profile.client_id !== null
  );
}

/** True when the user should stay on /user-portal until access is granted. */
export function isPendingAccess(profile: Profile | null): boolean {
  if (!profile) {
    return true;
  }

  return !hasStaffPortalAccess(profile) && !hasClientPortalAccess(profile);
}
