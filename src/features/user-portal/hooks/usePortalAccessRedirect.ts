import { useEffect } from "react";
import { useNavigate } from "react-router";

import { CLIENT_HOME, STAFF_HOME } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/providers/AuthProvider";

/** Refreshes profile on mount/focus and redirects when staff or client access is granted. */
export function usePortalAccessRedirect() {
  const navigate = useNavigate();
  const { loading, user, isStaff, isClient, refreshProfile } = useAuth();

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    const handleFocus = () => {
      void refreshProfile();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshProfile]);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    if (isStaff) {
      navigate(STAFF_HOME, { replace: true });
      return;
    }

    if (isClient) {
      navigate(CLIENT_HOME, { replace: true });
    }
  }, [loading, user, isStaff, isClient, navigate]);
}
