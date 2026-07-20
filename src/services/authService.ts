import type {
  AuthChangeEvent,
  AuthError,
  Provider,
  User,
  UserIdentity,
} from "@supabase/supabase-js";

import { AUTH_FORM_TYPES, type AuthFormType } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { supabase } from "@/services/supabaseClient";

export type AuthOAuthProvider = Extract<Provider, "google" | "facebook">;

function redirectUrl(formType: AuthFormType): string {
  return `${window.location.origin}${buildAuthUrl(formType)}`;
}

// Returns the signed-in user, or null when nobody is logged in.
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

// Runs the callback whenever the user signs in or out (ignores the first replay).
export function onAuthChange(
  callback: (user: User | null, event: AuthChangeEvent) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") {
      return;
    }
    callback(session?.user ?? null, event);
  });

  return () => data.subscription.unsubscribe();
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthError | null> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return error;
  }

  if (data.session) {
    return null;
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return signInError;
}

export async function signInWithOAuthProvider(
  provider: AuthOAuthProvider,
  isSignup: boolean,
): Promise<AuthError | null> {
  const formType = isSignup ? AUTH_FORM_TYPES.signup : AUTH_FORM_TYPES.login;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl(formType) },
  });
  return error;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Sets or replaces the Auth password (hashed in auth.users). Works for email and
// OAuth users so they can also sign in with email + password. Marks metadata so
// the Account UI can show "password set" without storing any secret in profiles.
export async function updatePassword(
  password: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.updateUser({
    password,
    data: { password_set: true },
  });
  return error;
}

// Sends a password-reset email. User lands on reset-password form via the link.
export async function requestPasswordReset(
  email: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: redirectUrl(AUTH_FORM_TYPES.resetPassword),
  });
  return error;
}

// Removes email/password login when the user still has another identity (e.g. Google).
// Email-only accounts cannot remove their only sign-in method.
export async function removePasswordLogin(): Promise<AuthError | Error | null> {
  const { data, error } = await supabase.auth.getUserIdentities();
  if (error) {
    return error;
  }

  const identities = data.identities ?? [];
  const emailIdentity = identities.find(
    (identity: UserIdentity) => identity.provider === "email",
  );
  const hasOtherSignIn = identities.some(
    (identity: UserIdentity) => identity.provider !== "email",
  );

  if (!hasOtherSignIn) {
    return new Error(
      "You can't remove your password without another sign-in method (e.g. Google).",
    );
  }

  if (emailIdentity) {
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(emailIdentity);
    if (unlinkError) {
      return unlinkError;
    }
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: { password_set: false },
  });
  return metaError;
}
