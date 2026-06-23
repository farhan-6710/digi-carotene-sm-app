import { clientShellConfig } from "@/features/client-portal-shell/constants/shellConfig";
import { ClientPortalProvider } from "@/features/client-portal/providers/ClientPortalProvider";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

function ClientBrandHeader() {
  const { client } = useClientPortal();

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

function ClientAppShell() {
  return (
    <AppShellLayout
      sidebarConfig={clientShellConfig}
      accountPath="/client-portal/account"
      headerCenter={<ClientBrandHeader />}
      mobileNavDescription="Client portal navigation links and quick actions"
    />
  );
}

export function ClientLayout() {
  return (
    <ClientPortalProvider>
      <ClientAppShell />
    </ClientPortalProvider>
  );
}
