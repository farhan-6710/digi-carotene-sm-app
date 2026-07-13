import { useLocation } from "react-router";

import { GrowthAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAccountHeaderMenu";
import { GrowthAdAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAdAccountHeaderMenu";
import { growthBasePath } from "@/features/growth-and-analytics/constants/navigation";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { GrowthSelectedAdAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAdAccountProvider";
import { TeamApprovalsHeaderButton } from "@/features/post-approvals/components/TeamApprovalsHeaderButton";
import { useTeamShellConfig } from "@/features/post-approvals/hooks/useTeamShellConfig";
import { TeamReviewerAccessProvider } from "@/features/post-approvals/providers/TeamReviewerAccessProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function TeamLayoutShell() {
  const sidebarConfig = useTeamShellConfig();
  const { pathname } = useLocation();
  const isGrowthRoute = pathname.startsWith(growthBasePath);
  const isCampaignsRoute = pathname.startsWith(`${growthBasePath}/campaigns`);

  const headerActions = isGrowthRoute ? (
    isCampaignsRoute ? (
      <GrowthAdAccountHeaderMenu />
    ) : (
      <GrowthAccountHeaderMenu />
    )
  ) : (
    <TeamApprovalsHeaderButton />
  );

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
      <GrowthSelectedAccountProvider>
        <GrowthSelectedAdAccountProvider>
          <TeamLayoutShell />
        </GrowthSelectedAdAccountProvider>
      </GrowthSelectedAccountProvider>
    </TeamReviewerAccessProvider>
  );
}
