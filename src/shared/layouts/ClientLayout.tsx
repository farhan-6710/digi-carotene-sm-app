import { portalShellConfig } from "@/features/portal-shell/constants/shellConfig";
import { PortalClientProvider, usePortalClient } from "@/features/portal/providers/PortalClientProvider";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function PortalBrandHeader() {
  const { client } = usePortalClient();

  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Client portal
      </p>
      <p className="truncate text-sm font-semibold text-foreground">
        {client?.client_name ?? "Loading…"}
      </p>
    </div>
  );
}

function PortalAppShell() {
  return (
    <AppShellLayout
      sidebarConfig={portalShellConfig}
      accountPath="/portal/account"
      headerCenter={<PortalBrandHeader />}
      mobileNavDescription="Portal navigation links and quick actions"
    />
  );
}

export function PortalLayout() {
  return (
    <PortalClientProvider>
      <PortalAppShell />
    </PortalClientProvider>
  );
}
