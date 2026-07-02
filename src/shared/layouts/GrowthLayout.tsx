import { useLocation } from "react-router";

import { GrowthAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAccountHeaderMenu";
import { GrowthAdAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAdAccountHeaderMenu";
import { growthShellConfig } from "@/features/growth-and-analytics/constants/shellConfig";
import { growthBasePath } from "@/features/growth-and-analytics/constants/navigation";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { GrowthSelectedAdAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAdAccountProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function GrowthLayoutShell() {
  const location = useLocation();
  const isCampaignsRoute = location.pathname.startsWith(
    `${growthBasePath}/campaigns`,
  );

  return (
    <AppShellLayout
      sidebarConfig={growthShellConfig}
      mobileNavDescription="Growth and analytics navigation links"
      headerActions={
        isCampaignsRoute ? (
          <GrowthAdAccountHeaderMenu />
        ) : (
          <GrowthAccountHeaderMenu />
        )
      }
    />
  );
}

export function GrowthLayout() {
  return (
    <GrowthSelectedAccountProvider>
      <GrowthSelectedAdAccountProvider>
        <GrowthLayoutShell />
      </GrowthSelectedAdAccountProvider>
    </GrowthSelectedAccountProvider>
  );
}
