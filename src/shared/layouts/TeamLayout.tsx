import { TeamApprovalsHeaderButton } from "@/features/post-approvals/components/TeamApprovalsHeaderButton";
import { useTeamShellConfig } from "@/features/post-approvals/hooks/useTeamShellConfig";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

export function TeamLayout() {
  const sidebarConfig = useTeamShellConfig();

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/team-portal/account"
      headerActions={<TeamApprovalsHeaderButton />}
      mobileNavDescription="Team portal navigation links and quick actions"
      scrollContainerId="team-portal"
    />
  );
}
