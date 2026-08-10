import type { ProductionPlan, ProductionPlanItem } from "./types";
import type { ProductionPlanFormValues } from "../utils/productionPlanFormUtils";
import type { ProductionPlanItemFormValues } from "../utils/productionPlanItemFormUtils";

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

export type ProductionPlanItemsTableProps = {
  items: ProductionPlanItem[];
  isLoading: boolean;
  canEdit: boolean;
  onEdit: (item: ProductionPlanItem) => void;
};

export type ProductionPlanItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ProductionPlanItemFormValues;
  onFieldChange: (
    field: keyof ProductionPlanItemFormValues,
    value: string,
  ) => void;
  onSave: () => void;
  onDelete?: () => void;
};
