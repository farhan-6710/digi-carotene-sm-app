import { createContext } from "react";
import type { AuthError, User } from "@supabase/supabase-js";

import type { Profile, UserRole } from "@/features/auth/types/profile";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

import type { AuthOAuthProvider } from "@/services/authService";

export type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  teamRole: TeamMemberRole | null;
  clientId: string | null;
  teamMemberId: string | null;
  isTeam: boolean;
  isClient: boolean;
  isPending: boolean;
  homePath: string;
  loading: boolean;
  /** True after the user opens a password-reset email link. */
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
  refreshProfile: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthError | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<AuthError | null>;
  signInWithOAuthProvider: (
    provider: AuthOAuthProvider,
    options?: { isSignup?: boolean },
  ) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
