import { useContext } from "react";

import { GrowthSelectedAdAccountContext } from "../providers/growthSelectedAdAccountContext";

export function useGrowthSelectedAdAccount() {
  const context = useContext(GrowthSelectedAdAccountContext);
  if (!context) {
    throw new Error(
      "useGrowthSelectedAdAccount must be used within GrowthSelectedAdAccountProvider",
    );
  }
  return context;
}
