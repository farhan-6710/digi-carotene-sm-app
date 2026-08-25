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
import { TeamNotificationsHeaderButton } from "@/features/notifications/components/TeamNotificationsHeaderButton";
import { TeamReviewerAccessProvider } from "@/features/post-approvals/providers/TeamReviewerAccessProvider";
import { useTeamShellConfig } from "@/features/team-portal-shell/hooks/useTeamShellConfig";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function TeamLayoutShell() {
  const { pathname } = useLocation();
  const sidebarConfig = useTeamShellConfig();
  const isGrowthRoute = pathname.startsWith(teamGrowthBasePath);
  const accounts = growthHeaderAccounts(pathname);

  let growthHeaderActions = null;
  if (isGrowthRoute) {
    if (accounts === "ad") {
      growthHeaderActions = <GrowthAdAccountHeaderMenu />;
    } else if (accounts === "organic") {
      growthHeaderActions = <GrowthAccountHeaderMenu />;
    }
  }

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/team-portal/account"
      settingsPath="/team-portal/settings"
      headerActions={
        <div className="flex items-center gap-2">
          <TeamNotificationsHeaderButton />
          {growthHeaderActions}
        </div>
      }
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
