import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthError, User } from "@supabase/supabase-js";

import { supabase } from "@/shared/lib/supabase";
import { fetchProfileByUserId } from "@/features/auth/utils/profileRepository";
import { fetchTeamRoleByEmail } from "@/features/auth/utils/teamRoleRepository";
import type { Profile, UserRole } from "@/features/auth/types/profile";
import { isAdminRole, isClientRole } from "@/features/auth/types/profile";
import { getHomePathForRole } from "@/features/auth/constants/routes";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  adminTeamRole: TeamMemberRole | null;
  clientId: string | null;
  isAdmin: boolean;
  isClient: boolean;
  homePath: string;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthError | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<AuthError | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const authRedirectUrl = () => `${window.location.origin}/auth`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminTeamRole, setAdminTeamRole] = useState<TeamMemberRole | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(true);

  // Step 1: listen for Supabase session only (no other Supabase calls here).
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

  // Step 2: load profile when user id changes (separate from auth listener).
  useEffect(() => {
    if (!user?.id) {
      // eslint-disable-next-line
      setProfile(null);
      // eslint-disable-next-line
      setProfileReady(true);
      return;
    }

    let isMounted = true;
    setProfileReady(false);

    void fetchProfileByUserId(user.id)
      .then((nextProfile) => {
        if (isMounted) {
          setProfile(nextProfile);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProfile(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setProfileReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Step 3: resolve the internal team role (admin / manager / executive) used
  // for RBAC, by matching the auth email to a team_members row.
  useEffect(() => {
    const email = user?.email;
    if (!email) {

      // eslint-disable-next-line
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
  const isAdmin = role !== null && isAdminRole(role);
  const isClient = role !== null && isClientRole(role) && Boolean(clientId);
  const homePath = role ? getHomePathForRole(role) : "/admin/dashboard";

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role,
      adminTeamRole,
      clientId,
      isAdmin,
      isClient,
      homePath,
      loading,
      signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return error;
      },
      signUpWithEmail: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: authRedirectUrl(),
          },
        });
        return error;
      },
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: authRedirectUrl() },
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
    [user, profile, role, adminTeamRole, clientId, isAdmin, isClient, homePath, loading],
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
