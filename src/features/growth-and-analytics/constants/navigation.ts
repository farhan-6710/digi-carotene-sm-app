import type { ShellNavItem } from "@/shared/types/components";

export const teamGrowthBasePath = "/team-portal/growth-and-analytics";
export const clientGrowthBasePath = "/client-portal/growth-and-analytics";

export function isGrowthPortalPath(pathname: string): boolean {
  return (
    pathname === teamGrowthBasePath ||
    pathname.startsWith(`${teamGrowthBasePath}/`) ||
    pathname === clientGrowthBasePath ||
    pathname.startsWith(`${clientGrowthBasePath}/`)
  );
}

export type BuildGrowthNavOptions = {
  includeManageAccounts?: boolean;
  /** Organic post insights. Default true. */
  includeContentPerformance?: boolean;
  /** Paid ads campaign analytics. Default true. */
  includeCampaignAnalytics?: boolean;
};

export function buildGrowthNav(
  basePath: string,
  options: BuildGrowthNavOptions = {},
): ShellNavItem[] {
  const {
    includeManageAccounts = true,
    includeContentPerformance = true,
    includeCampaignAnalytics = true,
  } = options;

  const items: ShellNavItem[] = [
    { label: "Dashboard", to: basePath, icon: "dashboard" },
  ];

  if (includeContentPerformance) {
    items.push({
      label: "Content Performance",
      to: `${basePath}/content-performance`,
      icon: "contentPerformance",
    });
  }

  if (includeCampaignAnalytics) {
    items.push({
      label: "Campaign Analytics",
      to: `${basePath}/campaigns`,
      icon: "campaigns",
    });
  }

  items.push(
    {
      label: "Custom Report Builder",
      to: `${basePath}/custom-report`,
      icon: "customReport",
    },
    {
      label: "Reports",
      to: `${basePath}/reports`,
      icon: "reportLibrary",
    },
  );

  if (includeManageAccounts) {
    items.push({
      label: "Manage Accounts",
      to: `${basePath}/manage-accounts`,
      icon: "manageAccounts",
    });
  }

  return items;
}

/** Team portal Growth sub-links (includes Manage Accounts). */
export const growthNav: ShellNavItem[] = buildGrowthNav(teamGrowthBasePath);

/** Client portal Growth sub-links filtered by linked account types. */
export function buildClientGrowthNav(options: {
  hasOrganic: boolean;
  hasAds: boolean;
}): ShellNavItem[] {
  const { hasOrganic, hasAds } = options;
  // Before accounts load (or none linked), keep the full read-only set.
  const filterByType = hasOrganic || hasAds;

  return buildGrowthNav(clientGrowthBasePath, {
    includeManageAccounts: false,
    includeContentPerformance: !filterByType || hasOrganic,
    includeCampaignAnalytics: !filterByType || hasAds,
  });
}

/** Default client Growth nav (both types) — prefer buildClientGrowthNav at runtime. */
export const clientGrowthNav: ShellNavItem[] = buildClientGrowthNav({
  hasOrganic: true,
  hasAds: true,
});
