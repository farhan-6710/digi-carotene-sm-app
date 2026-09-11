import { GrowthPortalProvider } from "@/features/growth-and-analytics/providers/GrowthPortalProvider";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { GrowthSelectedAdAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAdAccountProvider";
import { teamGrowthBasePath } from "@/features/growth-and-analytics/constants/navigation";
import { ChatPanelProvider } from "@/features/chat/providers/ChatPanelProvider";
import { TeamHeaderActions } from "@/features/chat/components/TeamHeaderActions";
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
      headerActions={<TeamHeaderActions />}
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
            <ChatPanelProvider>
              <TeamLayoutShell />
            </ChatPanelProvider>
          </GrowthSelectedAdAccountProvider>
        </GrowthSelectedAccountProvider>
      </GrowthPortalProvider>
    </TeamReviewerAccessProvider>
  );
}
