import { createContext } from "react";

import type { ProductionPlanContentSavePayload } from "@/features/production-planner/types/components";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";

export type ProductionPlanLightboxActions = {
  canEdit: boolean;
  canEditManagerApproval: boolean;
  canEditShootInchargeApproval: boolean;
  canEditClientApproval: boolean;
  canEditShootCompleted: boolean;
  lockDetails: boolean;
  showMutations: boolean;
  onSave: (id: string, payload: ProductionPlanContentSavePayload) => Promise<void>;
  onDuplicate: (content: ProductionPlanContent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export type ProductionPlanLightboxContextValue = {
  items: ProductionPlanContent[];
  activeIndex: number | null;
  isOpen: boolean;
  openAt: (contentId: string) => void;
  close: () => void;
  actions: ProductionPlanLightboxActions;
};

export const ProductionPlanLightboxContext =
  createContext<ProductionPlanLightboxContextValue | null>(null);
