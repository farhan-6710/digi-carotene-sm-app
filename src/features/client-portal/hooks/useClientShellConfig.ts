import { useMemo } from "react";

import { useClientGrowthAccounts } from "@/features/client-portal/hooks/useClientGrowthAccounts";
import { clientNav } from "@/features/client-portal-shell/constants/navigation";
import { clientShellConfig } from "@/features/client-portal-shell/constants/shellConfig";
import { buildClientGrowthNav } from "@/features/growth-and-analytics/constants/navigation";
import type { ShellSidebarConfig } from "@/shared/types/components";

const CLIENT_GROWTH_BASE = "/client-portal/growth-and-analytics";

export function useClientShellConfig(): ShellSidebarConfig {
  const { hasOrganic, hasAds, isLoading } = useClientGrowthAccounts();

  return useMemo(() => {
    // While loading, show the full set so the sidebar doesn't flash.
    const growthChildren = buildClientGrowthNav({
      hasOrganic: isLoading || hasOrganic,
      hasAds: isLoading || hasAds,
    }).map(({ label, to }) => ({ label, to }));

    const nav = clientNav.map((item) => {
      if (!item.to.startsWith(CLIENT_GROWTH_BASE)) {
        return item;
      }
      return {
        ...item,
        children: growthChildren,
      };
    });

    return {
      ...clientShellConfig,
      nav,
    };
  }, [hasAds, hasOrganic, isLoading]);
}
