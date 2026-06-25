import { teamShellConfig } from "@/features/team-portal-shell/constants/shellConfig";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

export function TeamLayout() {
  return (
    <AppShellLayout
      sidebarConfig={teamShellConfig}
      accountPath="/team-portal/account"
      mobileNavDescription="Team portal navigation links and quick actions"
      scrollContainerId="team-portal"
    />
  );
}
