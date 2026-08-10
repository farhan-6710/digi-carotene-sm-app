import type { ProductionPlan, ProductionPlanContent } from "./types";
import type { ProductionPlanFormValues } from "../utils/productionPlanFormUtils";
import type { ProductionPlanContentFormValues } from "../utils/productionPlanContentFormUtils";

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

export type ProductionPlanContentsTableProps = {
  contents: ProductionPlanContent[];
  isLoading: boolean;
  canEdit: boolean;
  onEdit: (content: ProductionPlanContent) => void;
};

export type ProductionPlanContentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ProductionPlanContentFormValues;
  onFieldChange: (
    field: keyof ProductionPlanContentFormValues,
    value: string,
  ) => void;
  onSave: () => void;
  onDelete?: () => void;
};
