import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { ADMIN_HOME } from "@/features/auth/constants/routes";
import { isClientRole } from "@/features/auth/types/profile";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ClientRoute() {
  const { loading, user, isClient, isAdmin, role, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CenteredLoading />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    return <Navigate to={ADMIN_HOME} replace />;
  }

  if (!isClient) {
    const missingClientLink = role && isClientRole(role);
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
        <p className="text-lg font-semibold">Portal access not configured</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {missingClientLink ? (
            <>
              Your account has the client role but is not linked to a brand yet.
              Ask your Digi Carotene admin to set{" "}
              <code className="text-xs">client_id</code> on your profile to a
              row in <code className="text-xs">public.clients</code>.
            </>
          ) : (
            <>
              Your account needs <code className="text-xs">role = client</code>{" "}
              and a <code className="text-xs">client_id</code> on your profile.
            </>
          )}
        </p>
      </div>
    );
  }

  return <Outlet />;
}
