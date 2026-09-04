import { GrowthPortalProvider } from "@/features/growth-and-analytics/providers/GrowthPortalProvider";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { GrowthSelectedAdAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAdAccountProvider";
import { teamGrowthBasePath } from "@/features/growth-and-analytics/constants/navigation";
import { TeamNotificationsHeaderButton } from "@/features/notifications/components/TeamNotificationsHeaderButton";
import { TeamReviewerAccessProvider } from "@/features/post-approvals/providers/TeamReviewerAccessProvider";
import { useTeamShellConfig } from "@/features/team-portal-shell/hooks/useTeamShellConfig";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function TeamLayoutShell() {
  const sidebarConfig = useTeamShellConfig();

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/team-portal/account"
      settingsPath="/team-portal/settings"
      headerActions={<TeamNotificationsHeaderButton />}
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
