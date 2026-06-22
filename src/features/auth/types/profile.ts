export type UserRole = "staff" | "client" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
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

/** True when the user should stay on /user-portal until access is granted. */
export function isPendingAccess(profile: Profile | null): boolean {
  if (!profile) {
    return true;
  }

  if (isStaffRole(profile.role)) {
    return false;
  }

  if (isClientRole(profile.role) && profile.client_id) {
    return false;
  }

  return true;
}
