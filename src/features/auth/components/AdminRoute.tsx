import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { PORTAL_HOME } from "@/features/auth/constants/routes";
import { isClientRole } from "@/features/auth/types/profile";

export function AdminRoute() {
  const { loading, user, isAdmin, role, profile, homePath } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
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
