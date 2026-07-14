import { useLocation } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useClientShellConfig } from "@/features/client-portal/hooks/useClientShellConfig";
import { ClientPortalProvider } from "@/features/client-portal/providers/ClientPortalProvider";
import { GrowthAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAccountHeaderMenu";
import { GrowthAdAccountHeaderMenu } from "@/features/growth-and-analytics/components/GrowthAdAccountHeaderMenu";
import {
  clientGrowthBasePath,
  growthHeaderAccounts,
  isGrowthPortalPath,
} from "@/features/growth-and-analytics/constants/navigation";
import { GrowthPortalProvider } from "@/features/growth-and-analytics/providers/GrowthPortalProvider";
import { GrowthSelectedAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAccountProvider";
import { GrowthSelectedAdAccountProvider } from "@/features/growth-and-analytics/providers/GrowthSelectedAdAccountProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function ClientAppShell() {
  const sidebarConfig = useClientShellConfig();
  const { pathname } = useLocation();
  const accounts = growthHeaderAccounts(pathname);

  let headerActions = <></>;
  if (isGrowthPortalPath(pathname)) {
    if (accounts === "ad") {
      headerActions = <GrowthAdAccountHeaderMenu />;
    } else if (accounts === "organic") {
      headerActions = <GrowthAccountHeaderMenu />;
    }
  }

  return (
    <AppShellLayout
      sidebarConfig={sidebarConfig}
      accountPath="/client-portal/account"
      headerActions={headerActions}
      mobileNavDescription="Client portal navigation links and quick actions"
    />
  );
}

export function ClientLayout() {
  const { clientId } = useAuth();

  return (
    <ClientPortalProvider>
      <GrowthPortalProvider
        basePath={clientGrowthBasePath}
        canManageAccounts={false}
      >
        <GrowthSelectedAccountProvider clientId={clientId}>
          <GrowthSelectedAdAccountProvider clientId={clientId}>
            <ClientAppShell />
          </GrowthSelectedAdAccountProvider>
        </GrowthSelectedAccountProvider>
      </GrowthPortalProvider>
    </ClientPortalProvider>
  );
}
