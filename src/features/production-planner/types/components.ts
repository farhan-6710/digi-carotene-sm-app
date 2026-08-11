import type {
  ProductionPlan,
  ProductionPlanContent,
  ProductionPlanApprovalStatus,
} from "./types";
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

export type ProductionPlanContentSavePayload = {
  itemName: string;
  itemNotes: string | null;
  managerApproval: ProductionPlanApprovalStatus;
  shootInchargeApproval: ProductionPlanApprovalStatus;
};

export type ProductionPlanContentsListProps = {
  contents: ProductionPlanContent[];
  isLoading: boolean;
  canEdit: boolean;
  onSave: (id: string, payload: ProductionPlanContentSavePayload) => Promise<void>;
  onDuplicate: (content: ProductionPlanContent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export type ProductionPlanContentCardProps = {
  content: ProductionPlanContent;
  index: number;
  canEdit: boolean;
  onSave: (id: string, payload: ProductionPlanContentSavePayload) => Promise<void>;
  onDuplicate: (content: ProductionPlanContent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
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

export type ApprovalStatusSelectProps = {
  id?: string;
  value: ProductionPlanApprovalStatus;
  onChange: (value: ProductionPlanApprovalStatus) => void;
  disabled?: boolean;
  placeholder?: string;
  listTitle?: string;
};
