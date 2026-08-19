import type { ShellSidebarConfig } from "@/shared/types/components";

import { clientMeta, clientNav } from "./navigation";

export const clientShellConfig: ShellSidebarConfig = {
  homeLink: "/client-portal/dashboard",
  initials: clientMeta.userInitials,
  brandName: clientMeta.name,
  brandSubtitle: clientMeta.portalLabel,
  nav: clientNav,
  searchPlaceholder: "Search client portal pages...",
  quickAction: {
    title: "Your content",
    description: "View your posts, projects, and production plans.",
    buttonLabel: "View Posts",
    buttonTo: "/client-portal/posts",
  },
};
