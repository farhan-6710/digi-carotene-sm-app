import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { getHomePathForProfile } from "@/features/auth/constants/routes";
import {
  AuthContext,
  type AuthContextValue,
} from "@/features/auth/providers/authContext";
import type { Profile } from "@/features/auth/types/profile";
import {
  hasClientPortalAccess,
  hasTeamPortalAccess,
  isPendingAccess,
} from "@/features/auth/types/profile";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import {
  getCurrentUser,
  onAuthChange,
  signInWithEmail,
  signInWithOAuthProvider,
  signOut,
  signUpWithEmail,
} from "@/services/authService";
import { fetchProfile, fetchTeamRole } from "@/services/profilesService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamRole, setTeamRole] = useState<TeamMemberRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // Load the profile for a user, plus their team role when they are team staff.
  const loadProfile = useCallback(async (currentUser: User) => {
    const nextProfile = await fetchProfile(currentUser.id);
    setProfile(nextProfile);

    if (nextProfile?.team_member_id) {
      setTeamRole(await fetchTeamRole(nextProfile.team_member_id));
    } else {
      setTeamRole(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user);
    }
  }, [user, loadProfile]);

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  useEffect(() => {
    let active = true;

    // 1. Load the current session once on startup.
    void getCurrentUser().then(async (currentUser) => {
      if (!active) {
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser);
      }
      setLoading(false);
    });

    // 2. React to later sign in / sign out / password recovery.
    const unsubscribe = onAuthChange((nextUser, event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }
      if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false);
      }

      setUser(nextUser);
      if (nextUser) {
        void loadProfile(nextUser);
      } else {
        setProfile(null);
        setTeamRole(null);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadProfile]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    setTeamRole(null);
    setIsPasswordRecovery(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      profile,
      role: profile?.role ?? null,
      teamRole,
      clientId: profile?.client_id ?? null,
      teamMemberId: profile?.team_member_id ?? null,
      isTeam: hasTeamPortalAccess(profile),
      isClient: hasClientPortalAccess(profile),
      isPending: isPendingAccess(profile),
      homePath: getHomePathForProfile(profile),
      loading,
      isPasswordRecovery,
      clearPasswordRecovery,
      refreshProfile,
      signInWithEmail,
      signUpWithEmail,
      signInWithOAuthProvider: (provider, options) =>
        signInWithOAuthProvider(provider, options?.isSignup ?? false),
      signOut: handleSignOut,
    };
  }, [
    user,
    profile,
    teamRole,
    loading,
    isPasswordRecovery,
    clearPasswordRecovery,
    refreshProfile,
    handleSignOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
