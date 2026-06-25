import { Navigate, Outlet, useLocation } from "react-router";

import {
  CLIENT_HOME,
  TEAM_HOME,
} from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function UserRoute() {
  const { loading, user, profile, isTeam, isClient } = useAuth();
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

  if (isClient) {
    return <Navigate to={CLIENT_HOME} replace />;
  }

  return <Outlet />;
}
