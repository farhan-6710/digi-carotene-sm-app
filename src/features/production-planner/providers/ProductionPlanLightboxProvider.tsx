import { useCallback, useMemo, useState, type ReactNode } from "react";

import { ProductionPlanContentLightbox } from "@/features/production-planner/components/ProductionPlanContentLightbox";
import {
  ProductionPlanLightboxContext,
  type ProductionPlanLightboxActions,
  type ProductionPlanLightboxContextValue,
} from "@/features/production-planner/providers/productionPlanLightboxContext";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";

export function ProductionPlanLightboxProvider({
  items,
  actions,
  children,
}: {
  items: ProductionPlanContent[];
  actions: ProductionPlanLightboxActions;
  children: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openAt = useCallback(
    (contentId: string) => {
      const index = items.findIndex((item) => item.id === contentId);
      if (index < 0) return;
      setActiveIndex(index);
    },
    [items],
  );

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const safeActiveIndex = useMemo(() => {
    if (activeIndex === null || items.length === 0) return null;
    return Math.min(activeIndex, items.length - 1);
  }, [activeIndex, items.length]);

  const value = useMemo<ProductionPlanLightboxContextValue>(
    () => ({
      items,
      activeIndex: safeActiveIndex,
      isOpen: safeActiveIndex !== null,
      openAt,
      close,
      actions,
    }),
    [actions, close, items, openAt, safeActiveIndex],
  );

  return (
    <ProductionPlanLightboxContext.Provider value={value}>
      {children}
      <ProductionPlanContentLightbox />
    </ProductionPlanLightboxContext.Provider>
  );
}
