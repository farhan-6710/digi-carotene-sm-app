export type UserRole = "team" | "client" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
  team_member_id: string | null;
};

export function isTeamRole(role: UserRole): boolean {
  return role === "team";
}

export function isClientRole(role: UserRole): boolean {
  return role === "client";
}

export function isUserRole(role: UserRole): boolean {
  return role === "user";
}

export function hasTeamPortalAccess(profile: Profile | null): boolean {
  return (
    profile !== null &&
    isTeamRole(profile.role) &&
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

  return !hasTeamPortalAccess(profile) && !hasClientPortalAccess(profile);
}
