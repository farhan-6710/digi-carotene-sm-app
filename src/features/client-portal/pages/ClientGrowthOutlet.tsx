import { Navigate, Outlet, useLocation } from "react-router";

import { useClientGrowthAccounts } from "@/features/client-portal/hooks/useClientGrowthAccounts";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

const GROWTH_BASE = "/client-portal/growth-and-analytics";

/** Gates client Growth routes: redirects when the needed account type is missing. */
export function ClientGrowthOutlet() {
  const { pathname } = useLocation();
  const { hasOrganic, hasAds, isLoading } = useClientGrowthAccounts();

  if (isLoading) {
    return <CenteredLoading />;
  }

  const onContentPerformance = pathname.includes("/content-performance");
  const onCampaigns = pathname.includes("/campaigns");

  // Only organic accounts → keep paid routes off the client portal.
  if (!hasOrganic && hasAds && onContentPerformance) {
    return <Navigate to={GROWTH_BASE} replace />;
  }

  // Only ads accounts → keep organic content routes off.
  if (!hasAds && hasOrganic && onCampaigns) {
    return <Navigate to={GROWTH_BASE} replace />;
  }

  // Each child page owns its heading (Dashboard, Content Performance, etc.).
  return <Outlet />;
}
