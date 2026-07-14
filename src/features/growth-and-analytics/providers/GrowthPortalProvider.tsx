import { useMemo, type ReactNode } from "react";

import {
  GrowthPortalContext,
  type GrowthPortalContextValue,
} from "./growthPortalContext";

export function GrowthPortalProvider({
  basePath,
  canManageAccounts,
  children,
}: GrowthPortalContextValue & { children: ReactNode }) {
  const value = useMemo(
    () => ({ basePath, canManageAccounts }),
    [basePath, canManageAccounts],
  );

  return (
    <GrowthPortalContext.Provider value={value}>
      {children}
    </GrowthPortalContext.Provider>
  );
}
