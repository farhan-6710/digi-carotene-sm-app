import type { ShellSidebarConfig } from "@/shared/types/components";

import { appMeta, primaryNav } from "./navigation";

export const teamShellConfig: ShellSidebarConfig = {
  homeLink: "/",
  initials: appMeta.userInitials,
  brandName: appMeta.name,
  nav: primaryNav,
  quickAction: {
    title: "Quick Actions",
    description: "Review today's scheduled posts and open the content calendar.",
    buttonLabel: "View Posts",
    buttonTo: "/team-portal/posts-management",
  },
};
