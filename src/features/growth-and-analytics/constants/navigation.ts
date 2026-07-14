import type { ShellNavItem } from "@/shared/types/components";

export const growthBasePath = "/team-portal/growth-and-analytics";

// Which account picker the shell header shows for a growth route. Reports and
// Custom Report Builder use "none" — they show an in-page combobox instead.
export type GrowthHeaderAccounts = "organic" | "ad" | "none";

const growthHeaderAccountRules: { prefix: string; show: GrowthHeaderAccounts }[] =
  [
    { prefix: `${growthBasePath}/custom-report`, show: "none" },
    { prefix: `${growthBasePath}/reports`, show: "none" },
    { prefix: `${growthBasePath}/campaigns`, show: "ad" },
  ];

export function growthHeaderAccounts(pathname: string): GrowthHeaderAccounts {
  return (
    growthHeaderAccountRules.find((rule) => pathname.startsWith(rule.prefix))
      ?.show ?? "organic"
  );
}

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
