import { useEffect } from "react";

import { useAuth } from "@/features/auth/providers/AuthProvider";

/** Re-checks profile on window focus so access grants redirect via UserRoute. */
export function usePortalAccessRedirect() {
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const handleFocus = () => {
      void refreshProfile();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshProfile]);
}
