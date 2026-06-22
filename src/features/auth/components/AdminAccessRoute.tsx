import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import {
  ADMIN_UNAUTHORIZED_PATH,
  canAccessModule,
} from "@/features/auth/constants/adminRbac";
import { type AdminAccessRouteProps } from "@/features/auth/types/components";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function AdminAccessRoute({ module }: AdminAccessRouteProps) {
  const { loading, adminTeamRole } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  if (!canAccessModule(adminTeamRole, module)) {
    return <Navigate to={ADMIN_UNAUTHORIZED_PATH} replace />;
  }

  return <Outlet />;
}
