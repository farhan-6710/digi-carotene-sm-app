import { useState } from "react";
import { Link, Outlet } from "react-router";
import { Menu, Moon, Search, Sun } from "lucide-react";

import { useThemePreference } from "@/features/admin-shell/providers/ThemePreferenceProvider";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import {
  ShellMobileNavSheet,
  ShellSidebar,
} from "@/shared/components/ShellSidebar";
import type { AppShellLayoutProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
} from "@/shared/utils/authUserDisplay";
import { cn } from "@/shared/lib/utils";

export function AppShellLayout({
  sidebarConfig,
  accountPath,
  headerCenter,
  mobileNavDescription,
  scrollContainerId,
}: AppShellLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isDarkMode, setDarkMode } = useThemePreference();
  const { user } = useAuth();
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const avatarUrl = getUserAvatarUrl(user);

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <ShellSidebar config={sidebarConfig} collapsed={isSidebarCollapsed} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border/60 bg-card py-1">
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
                className="hidden size-9 items-center justify-center rounded-xl md:inline-flex"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>

              {headerCenter ?? (
                <div className="relative w-full max-w-md">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Search className="size-4" aria-hidden="true" />
                  </span>
                  <input
                    type="search"
                    placeholder="Search clients or posts..."
                    className="h-9 w-full rounded-full border border-muted-foreground/30 bg-muted/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              )}

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
                  to={accountPath}
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

          <main
            {...(scrollContainerId ? { "data-admin-scroll-container": true } : {})}
            className="min-h-0 flex-1 overflow-y-auto scroll-smooth"
          >
            <div className="px-6 py-6 lg:px-8">
              <div className="mx-auto w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      <ShellMobileNavSheet
        config={sidebarConfig}
        open={isMobileNavOpen}
        onOpenChange={setIsMobileNavOpen}
        sheetDescription={mobileNavDescription}
      />
    </div>
  );
}
