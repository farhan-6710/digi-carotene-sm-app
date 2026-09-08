import { useContext } from "react";

import { ProductionPlanLightboxContext } from "@/features/production-planner/providers/productionPlanLightboxContext";

export function useProductionPlanLightbox() {
  const context = useContext(ProductionPlanLightboxContext);
  if (!context) {
    throw new Error(
      "useProductionPlanLightbox must be used within ProductionPlanLightboxProvider",
    );
  }
  return context;
}
