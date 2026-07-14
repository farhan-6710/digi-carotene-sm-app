import { createContext } from "react";

import {
  teamGrowthBasePath,
} from "@/features/growth-and-analytics/constants/navigation";

export type GrowthPortalContextValue = {
  basePath: string;
  canManageAccounts: boolean;
};

export const GrowthPortalContext = createContext<GrowthPortalContextValue>({
  basePath: teamGrowthBasePath,
  canManageAccounts: true,
});
