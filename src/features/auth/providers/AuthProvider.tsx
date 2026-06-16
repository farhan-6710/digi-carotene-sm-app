import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, AuthError, Session, User } from "@supabase/supabase-js";

import { supabase } from "@/shared/lib/supabase";
import { fetchProfileByUserId } from "@/features/auth/utils/profileRepository";
import type { Profile, UserRole } from "@/features/auth/types/profile";
import { isAdminRole, isClientRole } from "@/features/auth/types/profile";
import { getHomePathForRole } from "@/features/auth/constants/routes";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  profileError: string | null;
  profileLoading: boolean;
  role: UserRole | null;
  clientId: string | null;
  isAdmin: boolean;
  isClient: boolean;
  homePath: string;
  loading: boolean;
  refreshProfile: () => Promise<void>;
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

/** Profile-changing auth events only — not tab-focus token refresh. */
function shouldReloadProfile(
  event: AuthChangeEvent,
  userId: string | undefined,
  loadedProfileUserId: string | null,
): boolean {
  if (!userId) {
    return false;
  }

  if (event === "USER_UPDATED") {
    return true;
  }

  if (event === "SIGNED_IN") {
    return loadedProfileUserId !== userId;
  }

  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadedProfileUserIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  userIdRef.current = user?.id;

  const loadProfile = useCallback(
    async (userId: string | undefined, options?: { blocking?: boolean }) => {
      if (!userId) {
        setProfile(null);
        setProfileError(null);
        loadedProfileUserIdRef.current = null;
        setProfileLoading(false);
        return;
      }

      if (options?.blocking) {
        setProfileLoading(true);
      }

      setProfileError(null);

      try {
        const nextProfile = await fetchProfileByUserId(userId);
        setProfile(nextProfile);
        loadedProfileUserIdRef.current = nextProfile ? userId : null;
        if (!nextProfile) {
          setProfileError(
            "No profile row returned for your user. Run scripts/setup-database.sql or sign up again after a reset.",
          );
        }
      } catch (err) {
        setProfile(null);
        loadedProfileUserIdRef.current = null;
        setProfileError(
          err instanceof Error ? err.message : "Failed to load profile.",
        );
      } finally {
        if (options?.blocking) {
          setProfileLoading(false);
        }
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) {
      return;
    }

    loadedProfileUserIdRef.current = null;
    await loadProfile(userId, { blocking: true });
  }, [loadProfile]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      await loadProfile(data.session?.user?.id, { blocking: true });
      if (isMounted) {
        setLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (event === "SIGNED_OUT") {
        setProfile(null);
        setProfileError(null);
        loadedProfileUserIdRef.current = null;
        setProfileLoading(false);
      } else if (
        shouldReloadProfile(
          event,
          nextSession?.user?.id,
          loadedProfileUserIdRef.current,
        )
      ) {
        void loadProfile(nextSession?.user?.id, {
          blocking: !loadedProfileUserIdRef.current,
        });
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const role = profile?.role ?? null;
  const clientId = profile?.client_id ?? null;
  const isAdmin = role !== null && isAdminRole(role);
  const isClient =
    role !== null && isClientRole(role) && Boolean(clientId);
  const homePath = role
    ? getHomePathForRole(role)
    : "/admin/dashboard";

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      profileError,
      profileLoading,
      role,
      clientId,
      isAdmin,
      isClient,
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
        setProfile(null);
        loadedProfileUserIdRef.current = null;
      },
    }),
    [
      user,
      session,
      profile,
      profileError,
      profileLoading,
      role,
      clientId,
      isAdmin,
      isClient,
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
