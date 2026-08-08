import type { ProductionPlan } from "./types";
import type { ProductionPlanFormValues } from "../utils/productionPlanFormUtils";

export type ProductionPlansTableProps = {
  plans: ProductionPlan[];
  isLoading: boolean;
  canEdit: boolean;
  onEdit: (plan: ProductionPlan) => void;
};

export type ProductionPlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ProductionPlanFormValues;
  onFieldChange: (field: keyof ProductionPlanFormValues, value: string) => void;
  onSave: () => void;
  onDelete?: () => void;
};
