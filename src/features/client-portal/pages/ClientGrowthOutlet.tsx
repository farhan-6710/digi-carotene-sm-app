import { Navigate, Outlet, useLocation } from "react-router";

import { useClientGrowthAccounts } from "@/features/client-portal/hooks/useClientGrowthAccounts";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";
import { PageShell } from "@/shared/components/PageShell";

const GROWTH_BASE = "/client-portal/growth-and-analytics";

/** Gates client Growth routes: empty state until the team links accounts. */
export function ClientGrowthOutlet() {
  const { pathname } = useLocation();
  const { hasAccounts, hasOrganic, hasAds, isLoading, error } =
    useClientGrowthAccounts();

  if (isLoading) {
    return <CenteredLoading />;
  }

  if (!hasAccounts) {
    return (
      <PageShell
        heading="Growth & Analytics"
        description="Performance insights for the social and ad accounts connected to your brand."
        error={error}
      >
        <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Your analytics aren’t connected yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please contact Digi Carotene to connect your social and ad accounts.
          </p>
        </div>
      </PageShell>
    );
  }

  const onContentPerformance = pathname.includes("/content-performance");
  const onCampaigns = pathname.includes("/campaigns");

  if (!hasOrganic && onContentPerformance) {
    return <Navigate to={GROWTH_BASE} replace />;
  }

  if (!hasAds && onCampaigns) {
    return <Navigate to={GROWTH_BASE} replace />;
  }

  return <Outlet />;
}
