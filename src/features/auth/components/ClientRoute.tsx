import { Navigate, Outlet, useLocation } from "react-router";

import { TEAM_HOME, USER_HOME } from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function ClientRoute() {
  const { loading, user, isClient, isTeam, isPending, profile } = useAuth();
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

  if (isTeam) {
    return <Navigate to={TEAM_HOME} replace />;
  }

  if (isPending || !isClient) {
    return <Navigate to={USER_HOME} replace />;
  }

  return <Outlet />;
}
