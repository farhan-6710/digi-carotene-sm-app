import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthError, User } from "@supabase/supabase-js";

import { supabase } from "@/shared/lib/supabase";
import { AUTH_FORM_TYPES, type AuthFormType } from "@/features/auth/constants/auth";
import { getHomePathForProfile } from "@/features/auth/constants/routes";
import type { Profile, UserRole } from "@/features/auth/types/profile";
import { isClientRole, isStaffRole, isPendingAccess } from "@/features/auth/types/profile";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { loadProfileForUser } from "@/features/auth/utils/profileRoleSync";
import { fetchTeamRoleByEmail } from "@/features/auth/utils/teamRoleRepository";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  adminTeamRole: TeamMemberRole | null;
  clientId: string | null;
  isStaff: boolean;
  isClient: boolean;
  isPending: boolean;
  homePath: string;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthError | null>;
  signUpWithOtp: (email: string, fullName: string) => Promise<AuthError | null>;
  signInWithGoogle: (options?: { isSignup?: boolean }) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const authRedirectUrl = (formType: AuthFormType = AUTH_FORM_TYPES.login) =>
  `${window.location.origin}${buildAuthUrl(formType)}`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminTeamRole, setAdminTeamRole] = useState<TeamMemberRole | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(true);

  const loadProfile = useCallback(
    async (authUser: User, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setProfileReady(false);
      }

      try {
        const nextProfile = await loadProfileForUser(authUser);
        setProfile(nextProfile);
      } catch {
        setProfile(null);
      } finally {
        setProfileReady(true);
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    if (!user) {
      return;
    }

    await loadProfile(user, { silent: true });
  }, [loadProfile, user]);

  useEffect(() => {
    let isMounted = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) {
        return;
      }
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileReady(true);
      return;
    }

    let isMounted = true;

    void loadProfile(user).then(() => {
      if (!isMounted) {
        return;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user, loadProfile]);

  useEffect(() => {
    const email = user?.email;
    if (!email) {
      setAdminTeamRole(null);
      return;
    }

    let isMounted = true;

    void fetchTeamRoleByEmail(email)
      .then((teamRole) => {
        if (isMounted) {
          setAdminTeamRole(teamRole);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAdminTeamRole(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const loading = !authReady || (user !== null && !profileReady);

  const role = profile?.role ?? null;
  const clientId = profile?.client_id ?? null;
  const isStaff = role !== null && isStaffRole(role);
  const isClient =
    role !== null && isClientRole(role) && Boolean(clientId);
  const isPending = isPendingAccess(profile);
  const homePath = getHomePathForProfile(profile);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role,
      adminTeamRole,
      clientId,
      isStaff,
      isClient,
      isPending,
      homePath,
      loading,
      refreshProfile,
      signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return error;
      },
      signUpWithOtp: async (email, fullName) => {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: { full_name: fullName },
            emailRedirectTo: authRedirectUrl(AUTH_FORM_TYPES.login),
          },
        });
        return error;
      },
      signInWithGoogle: async (options) => {
        const formType = options?.isSignup
          ? AUTH_FORM_TYPES.signup
          : AUTH_FORM_TYPES.login;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: authRedirectUrl(formType) },
        });
        return error;
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setAdminTeamRole(null);
      },
    }),
    [
      user,
      profile,
      role,
      adminTeamRole,
      clientId,
      isStaff,
      isClient,
      isPending,
      homePath,
      loading,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
