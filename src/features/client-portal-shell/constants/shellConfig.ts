import type { ShellSidebarConfig } from "@/shared/types/components";

import { portalMeta, portalNav } from "./navigation";

export const portalShellConfig: ShellSidebarConfig = {
  homeLink: "/portal/dashboard",
  initials: portalMeta.userInitials,
  brandName: portalMeta.name,
  brandSubtitle: portalMeta.portalLabel,
  nav: portalNav,
  quickAction: {
    title: "Your content",
    description: "View scheduled posts and account details for your brand.",
    buttonLabel: "View Posts",
    buttonTo: "/portal/posts",
  },
};
