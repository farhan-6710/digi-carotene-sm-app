import type { ShellNavItem } from "@/shared/types/components";

export const growthBasePath = "/team-portal/growth-and-analytics";

export const growthNav: ShellNavItem[] = [
  { label: "Dashboard", to: growthBasePath, icon: "dashboard" },
  {
    label: "Content Performance",
    to: `${growthBasePath}/content-performance`,
    icon: "contentPerformance",
  },
  {
    label: "Campaign Analytics",
    to: `${growthBasePath}/campaigns`,
    icon: "campaigns",
  },
  {
    label: "Custom Report Builder",
    to: `${growthBasePath}/custom-report`,
    icon: "customReport",
  },
  {
    label: "Reports",
    to: `${growthBasePath}/reports`,
    icon: "reportLibrary",
  },
  {
    label: "Manage Accounts",
    to: `${growthBasePath}/manage-accounts`,
    icon: "manageAccounts",
  },
];
