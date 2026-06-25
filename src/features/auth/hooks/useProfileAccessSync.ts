import { useEffect } from "react";

import {
  CLIENT_HOME,
  isClientPath,
  isTeamPath,
  TEAM_HOME,
  USER_HOME,
} from "@/features/auth/constants/routes";
import {
  hasClientPortalAccess,
  hasTeamPortalAccess,
} from "@/features/auth/types/profile";
import type { Profile } from "@/features/auth/types/profile";
import { supabase } from "@/shared/lib/supabase";

type UseProfileAccessSyncOptions = {
  userId: string | undefined;
  loading: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
};

function replacePath(path: string) {
  if (window.location.pathname === path) {
    return;
  }

  window.location.replace(path);
}

function redirectForPortalAccess(profile: Profile | null) {
  if (!profile) {
    return;
  }

  const pathname = window.location.pathname;
  const teamAccess = hasTeamPortalAccess(profile);
  const clientAccess = hasClientPortalAccess(profile);

  if (isTeamPath(pathname) && !teamAccess) {
    replacePath(USER_HOME);
    return;
  }

  if (isClientPath(pathname) && !clientAccess) {
    replacePath(USER_HOME);
    return;
  }

  if (pathname.startsWith(USER_HOME) && teamAccess) {
    replacePath(TEAM_HOME);
    return;
  }

  if (pathname.startsWith(USER_HOME) && clientAccess) {
    replacePath(CLIENT_HOME);
  }
}

export function useProfileAccessSync({
  userId,
  loading,
  profile,
  refreshProfile,
}: UseProfileAccessSyncOptions) {
  useEffect(() => {
    if (loading || !userId) {
      return;
    }

    redirectForPortalAccess(profile);
  }, [loading, userId, profile]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const handleRefresh = () => {
      void refreshProfile();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshProfile();
      }
    };

    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshProfile, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase
      .channel(`profile-access-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        () => {
          void refreshProfile();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refreshProfile, userId]);
}
