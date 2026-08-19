import type { ContentApprovalFilterId } from "@/features/production-planner/constants/contentApprovalFilters";
import type {
  ProductionPlan,
  ProductionPlanContent,
  ProductionPlanApprovalStatus,
} from "./types";
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
  draftContent?: ProductionPlanContent | null;
  draftFocusKey?: number;
  onSave: (id: string, payload: ProductionPlanContentSavePayload) => Promise<void>;
  onDuplicate: (content: ProductionPlanContent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDiscardDraft?: () => void;
};

export type ProductionPlanContentCardProps = {
  content: ProductionPlanContent;
  index: number;
  canEdit: boolean;
  isDraft?: boolean;
  onSave: (id: string, payload: ProductionPlanContentSavePayload) => Promise<void>;
  onDuplicate: (content: ProductionPlanContent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDiscard?: () => void;
};

export type ApprovalStatusSelectProps = {
  id?: string;
  value: ProductionPlanApprovalStatus;
  onChange: (value: ProductionPlanApprovalStatus) => void;
  disabled?: boolean;
  placeholder?: string;
  listTitle?: string;
};

export type ProductionPlanContentApprovalFilterProps = {
  value: ContentApprovalFilterId;
  onChange: (value: ContentApprovalFilterId) => void;
  disabled?: boolean;
};
