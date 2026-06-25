import { Navigate, Outlet, useLocation } from "react-router";

import {
  CLIENT_HOME,
  USER_HOME,
} from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function TeamRoute() {
  const { loading, user, isTeam, isClient, isPending, profile } = useAuth();
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

  if (isPending || !isTeam) {
    return <Navigate to={isClient ? CLIENT_HOME : USER_HOME} replace />;
  }

  return <Outlet />;
}
