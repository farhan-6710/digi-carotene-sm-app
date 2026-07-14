import { format } from "date-fns";
import type { User } from "@supabase/supabase-js";

export function getUserDisplayName(user: User | null): string {
  if (!user) {
    return "Guest";
  }

  const metadata = user.user_metadata;

  return (
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    (metadata.user_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "User"
  );
}

export function getUserInitials(user: User | null): string {
  const displayName = getUserDisplayName(user);
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}

export function getUserEmail(user: User | null): string {
  return user?.email ?? "Not provided";
}

export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata;

  return (
    (metadata.avatar_url as string | undefined) ??
    (metadata.picture as string | undefined) ??
    null
  );
}

export function getUserJoinedDate(user: User | null): string {
  if (!user?.created_at) {
    return "Not provided";
  }

  return format(new Date(user.created_at), "MMMM yyyy");
}

export function getUserAuthProvider(user: User | null): string {
  const provider = user?.app_metadata?.provider;

  if (!provider || typeof provider !== "string") {
    return "Not provided";
  }

  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

/** True when the user can sign in with email + password (signup or Account set). */
export function userHasPasswordLogin(user: User | null): boolean {
  if (!user) {
    return false;
  }

  if (user.user_metadata?.password_set === true) {
    return true;
  }

  return (user.identities ?? []).some((identity) => identity.provider === "email");
}

/** True when password can be removed without locking the user out of the app. */
export function userCanRemovePassword(user: User | null): boolean {
  if (!user || !userHasPasswordLogin(user)) {
    return false;
  }

  return (user.identities ?? []).some(
    (identity) => identity.provider !== "email",
  );
}
