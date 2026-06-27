import type { AuthError, User } from "@supabase/supabase-js";

import { AUTH_FORM_TYPES, type AuthFormType } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { supabase } from "@/services/supabaseClient";

function redirectUrl(formType: AuthFormType): string {
  return `${window.location.origin}${buildAuthUrl(formType)}`;
}

// Returns the signed-in user, or null when nobody is logged in.
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

// Runs the callback whenever the user signs in or out (ignores the first replay).
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") {
      return;
    }
    callback(session?.user ?? null);
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

export async function signUpWithOtp(
  email: string,
  fullName: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: { full_name: fullName },
      emailRedirectTo: redirectUrl(AUTH_FORM_TYPES.login),
    },
  });
  return error;
}

export async function signInWithGoogle(isSignup: boolean): Promise<AuthError | null> {
  const formType = isSignup ? AUTH_FORM_TYPES.signup : AUTH_FORM_TYPES.login;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectUrl(formType) },
  });
  return error;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
