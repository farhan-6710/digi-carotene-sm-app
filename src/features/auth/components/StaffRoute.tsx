import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { PORTAL_HOME } from "@/features/auth/constants/routes";
import { isClientRole } from "@/features/auth/types/profile";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function AdminRoute() {
  const { loading, user, isAdmin, role, profile, homePath } = useAuth();
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

  if (role && isClientRole(role)) {
    return <Navigate to={PORTAL_HOME} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
}
