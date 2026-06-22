import { Navigate, Outlet, useLocation } from "react-router";

import {
  CLIENT_HOME,
  STAFF_HOME,
} from "@/features/auth/constants/routes";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function UserRoute() {
  const { loading, user, profile, isStaff, isClient } = useAuth();
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

  if (isStaff) {
    return <Navigate to={STAFF_HOME} replace />;
  }

  if (isClient) {
    return <Navigate to={CLIENT_HOME} replace />;
  }

  return <Outlet />;
}
