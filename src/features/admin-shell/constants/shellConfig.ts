import type { ShellSidebarConfig } from "@/shared/types/components";

import { appMeta, primaryNav } from "./navigation";

export const adminShellConfig: ShellSidebarConfig = {
  homeLink: "/",
  initials: appMeta.userInitials,
  brandName: appMeta.name,
  nav: primaryNav,
  quickAction: {
    title: "Quick Actions",
    description: "Review today's client posts and content schedule.",
    buttonLabel: "View Posts",
    buttonTo: "/admin/posts-management",
  },
};
