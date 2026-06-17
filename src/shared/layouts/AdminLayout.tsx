import { adminShellConfig } from "@/features/admin-shell/constants/shellConfig";
import { AppShellLayout } from "@/shared/layouts/AppShellLayout";

export function AdminLayout() {
  return (
    <AppShellLayout
      sidebarConfig={adminShellConfig}
      accountPath="/admin/account"
      mobileNavDescription="Admin navigation links and quick actions"
      scrollContainerId="admin"
    />
  );
}
