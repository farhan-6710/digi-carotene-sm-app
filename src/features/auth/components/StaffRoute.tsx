import { Navigate, Outlet, useLocation } from "react-router";

import {
  CLIENT_HOME,
  USER_HOME,
} from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function StaffRoute() {
  const { loading, user, isStaff, isClient, profile } = useAuth();
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

  if (!isStaff) {
    return <Navigate to={isClient ? CLIENT_HOME : USER_HOME} replace />;
  }

  return <Outlet />;
}
