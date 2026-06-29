import { useEffect } from "react";

import { GROWTH_ACCOUNTS_UPDATED_EVENT } from "@/features/growth-and-analytics/constants/growthAccountsEvents";

export function useGrowthAccountsUpdated(reload: () => void | Promise<void>) {
  useEffect(() => {
    const handle = () => {
      void reload();
    };

    window.addEventListener(GROWTH_ACCOUNTS_UPDATED_EVENT, handle);
    return () => window.removeEventListener(GROWTH_ACCOUNTS_UPDATED_EVENT, handle);
  }, [reload]);
}
