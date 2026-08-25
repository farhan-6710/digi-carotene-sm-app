import { Navigate, Outlet } from "react-router";

import { usePermissions } from "@/shared/hooks/usePermissions";

/** Blocks CRM routes for non-admins (matches sidebar RBAC). */
export function CrmAccessGate() {
  const { can } = usePermissions();

  if (!can("crm.read")) {
    return <Navigate to="/team-portal/dashboard" replace />;
  }

  return <Outlet />;
}
