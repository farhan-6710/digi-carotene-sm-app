import { useRef, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { useTheme } from "@/shared/providers/ThemeProvider";
import { PortalUserHeaderMenu } from "@/shared/components/PortalUserHeaderMenu";
import {
  ShellMobileNavSheet,
  ShellSidebar,
} from "@/shared/components/ShellSidebar";
import { ShellNavSearch } from "@/shared/components/ShellNavSearch";
import {
  PageTransitionMain,
  PageTransitionProvider,
} from "@/shared/providers/PageTransitionProvider";
import { SHELL_HEADER_MOTION } from "@/shared/constants/pageMotion";
import type { AppShellLayoutProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";

export function AppShellLayout({
  sidebarConfig,
  accountPath,
  settingsPath,
  headerCenter,
  headerActions,
  mobileNavDescription,
}: AppShellLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isDarkMode, setDarkMode } = useTheme();
  const mainRef = useRef<HTMLElement>(null);

  return (
    <PageTransitionProvider>
      <div className="fixed inset-0 grid grid-cols-[auto_minmax(0,1fr)] overflow-hidden bg-background text-foreground">
        <ShellSidebar config={sidebarConfig} collapsed={isSidebarCollapsed} />

        <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
          <motion.header
            {...SHELL_HEADER_MOTION}
            className="flex shrink-0 items-center gap-4 border-b border-border/60 bg-card px-4 py-4 sm:px-6"
          >
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

            <div className="flex min-w-0 flex-1 items-center gap-4">
              <ShellNavSearch
                nav={sidebarConfig.nav}
                placeholder={
                  sidebarConfig.searchPlaceholder ?? "Search navigation..."
                }
              />
              {headerCenter}
            </div>

            <div className="ml-auto flex items-center gap-3">
              {headerActions}
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
              {accountPath ? (
                <PortalUserHeaderMenu
                  accountPath={accountPath}
                  settingsPath={settingsPath}
                />
              ) : null}
            </div>
          </motion.header>

          <PageTransitionMain
            mainRef={mainRef}
            className="min-h-0 overflow-y-auto px-6 py-6 lg:px-8"
          />
        </div>
      </div>

      <ShellMobileNavSheet
        config={sidebarConfig}
        open={isMobileNavOpen}
        onOpenChange={setIsMobileNavOpen}
        sheetDescription={mobileNavDescription}
      />
    </PageTransitionProvider>
  );
}
