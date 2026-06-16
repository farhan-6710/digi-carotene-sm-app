import { Link, Outlet } from "react-router";
import { Menu, Sun, Moon } from "lucide-react";
import { type ReactNode, useState } from "react";

import {
  PortalMobileNavSheet,
  PortalSidebar,
} from "@/features/portal-shell/components/PortalSidebar";
import { PortalClientProvider } from "@/features/portal/providers/PortalClientProvider";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { useThemePreference } from "@/features/admin-shell/providers/ThemePreferenceProvider";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { usePortalClient } from "@/features/portal/providers/PortalClientProvider";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
} from "@/shared/utils/authUserDisplay";
import { cn } from "@/shared/lib/utils";

function ShellSection({ children }: { children: ReactNode }) {
  return <div className="px-6 py-6 lg:px-8">{children}</div>;
}

function PortalLayoutShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isDarkMode, setDarkMode } = useThemePreference();
  const { user } = useAuth();
  const { client } = usePortalClient();
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const avatarUrl = getUserAvatarUrl(user);

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <PortalSidebar collapsed={isSidebarCollapsed} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="py-1 border-b border-border/60 bg-card">
            <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Open navigation menu"
                className="inline-flex size-9 items-center justify-center rounded-xl border border-border md:hidden"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label={
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
                className="hidden size-9 items-center justify-center rounded-xl border border-border md:inline-flex"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Client portal
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {client?.client_name ?? "Loading…"}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sun className="size-4" aria-hidden="true" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setDarkMode}
                    aria-label="Toggle dark mode"
                    className="cursor-pointer"
                  />
                  <Moon className="size-4" aria-hidden="true" />
                </div>
                <Link
                  to="/portal/account"
                  className={cn(
                    "flex size-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/20",
                    avatarUrl && "bg-transparent",
                  )}
                  aria-label={`Open account for ${displayName}`}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="size-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </Link>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
            <ShellSection>
              <div className="mx-auto w-full">
                <Outlet />
              </div>
            </ShellSection>
          </main>
        </div>
      </div>

      <PortalMobileNavSheet
        open={isMobileNavOpen}
        onOpenChange={setIsMobileNavOpen}
      />
    </div>
  );
}

export function PortalLayout() {
  return (
    <PortalClientProvider>
      <PortalLayoutShell />
    </PortalClientProvider>
  );
}
