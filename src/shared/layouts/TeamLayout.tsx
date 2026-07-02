import { TeamApprovalsHeaderButton } from "@/features/post-approvals/components/TeamApprovalsHeaderButton";
import { useTeamShellConfig } from "@/features/post-approvals/hooks/useTeamShellConfig";
import { TeamReviewerAccessProvider } from "@/features/post-approvals/providers/TeamReviewerAccessProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function TeamLayoutShell() {
  const sidebarConfig = useTeamShellConfig();

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/team-portal/account"
      settingsPath="/team-portal/settings"
      headerActions={<TeamApprovalsHeaderButton />}
      mobileNavDescription="Team portal navigation links and quick actions"
    />
  );
}

export function TeamLayout() {
  return (
    <TeamReviewerAccessProvider>
      <TeamLayoutShell />
    </TeamReviewerAccessProvider>
  );
}
