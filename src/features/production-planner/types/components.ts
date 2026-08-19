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
  clientFilter: string;
  onClientFilterChange: (clientId: string) => void;
  clientOptions: { value: string; label: string }[];
};

export type ProductionPlanClientFilterProps = {
  value: string;
  onChange: (clientId: string) => void;
  clients: { value: string; label: string }[];
  disabled?: boolean;
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
  script: string | null;
  referenceLink: string | null;
  managerApproval: ProductionPlanApprovalStatus;
  shootInchargeApproval: ProductionPlanApprovalStatus;
  clientApproval: ProductionPlanApprovalStatus;
};

export type ProductionPlanContentsListProps = {
  contents: ProductionPlanContent[];
  isLoading: boolean;
  canEdit: boolean;
  canEditManagerApproval: boolean;
  canEditShootInchargeApproval: boolean;
  canEditClientApproval: boolean;
  lockDetails?: boolean;
  showMutations?: boolean;
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
  canEditManagerApproval: boolean;
  canEditShootInchargeApproval: boolean;
  canEditClientApproval: boolean;
  lockDetails?: boolean;
  showMutations?: boolean;
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

export type ClientProductionPlansSectionProps = {
  plans: ProductionPlan[];
  isLoading: boolean;
};

export type ProductionPlanMultiSelectProps = {
  value: string[];
  onChange: (planIds: string[]) => void;
  disabled?: boolean;
  excludePlanIds?: string[];
  placeholder?: string;
  preload?: boolean;
};
