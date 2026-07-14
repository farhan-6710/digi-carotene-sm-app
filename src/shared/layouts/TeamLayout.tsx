import { useLocation } from "react-router";

import { GrowthAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAccountHeaderMenu";
import { GrowthAdAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAdAccountHeaderMenu";
import {
  growthHeaderAccounts,
  teamGrowthBasePath,
} from "@/features/growth-and-analytics/constants/navigation";
import { GrowthPortalProvider } from "@/features/growth-and-analytics/providers/GrowthPortalProvider";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { GrowthSelectedAdAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAdAccountProvider";
import { TeamApprovalsHeaderButton } from "@/features/post-approvals/components/TeamApprovalsHeaderButton";
import { useTeamShellConfig } from "@/features/post-approvals/hooks/useTeamShellConfig";
import { TeamReviewerAccessProvider } from "@/features/post-approvals/providers/TeamReviewerAccessProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function TeamLayoutShell() {
  const sidebarConfig = useTeamShellConfig();
  const { pathname } = useLocation();
  const isGrowthRoute = pathname.startsWith(teamGrowthBasePath);
  const accounts = growthHeaderAccounts(pathname);

  let headerActions = <TeamApprovalsHeaderButton />;
  if (isGrowthRoute) {
    if (accounts === "ad") {
      headerActions = <GrowthAdAccountHeaderMenu />;
    } else if (accounts === "organic") {
      headerActions = <GrowthAccountHeaderMenu />;
    } else {
      headerActions = <></>;
    }
  }

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/team-portal/account"
      settingsPath="/team-portal/settings"
      headerActions={headerActions}
      mobileNavDescription="Team portal navigation links and quick actions"
    />
  );
}

export function TeamLayout() {
  return (
    <TeamReviewerAccessProvider>
      <GrowthPortalProvider
        basePath={teamGrowthBasePath}
        canManageAccounts={true}
      >
        <GrowthSelectedAccountProvider>
          <GrowthSelectedAdAccountProvider>
            <TeamLayoutShell />
          </GrowthSelectedAdAccountProvider>
        </GrowthSelectedAccountProvider>
      </GrowthPortalProvider>
    </TeamReviewerAccessProvider>
  );
}
