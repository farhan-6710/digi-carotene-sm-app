import { useContext } from "react";

import { GrowthSelectedAccountContext } from "../providers/growthSelectedAccountContext";

export function useGrowthSelectedAccount() {
  const context = useContext(GrowthSelectedAccountContext);
  if (!context) {
    throw new Error(
      "useGrowthSelectedAccount must be used within GrowthSelectedAccountProvider",
    );
  }
  return context;
}
