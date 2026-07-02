import { GrowthAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAccountHeaderMenu";
import { growthShellConfig } from "@/features/growth-and-analytics/constants/shellConfig";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function GrowthLayoutShell() {
  return (
    <AppShellLayout
      sidebarConfig={growthShellConfig}
      mobileNavDescription="Growth and analytics navigation links"
      headerActions={<GrowthAccountHeaderMenu />}
    />
  );
}

export function GrowthLayout() {
  return (
    <GrowthSelectedAccountProvider>
      <GrowthLayoutShell />
    </GrowthSelectedAccountProvider>
  );
}
