import type {
  LeadFormField,
  LeadFormValues,
} from "@/features/crm/utils/leadFormUtils";
import type {
  Lead,
  LeadScore,
  LeadSource,
  LeadStatus,
} from "@/features/crm/types/types";

export type LeadsTableRowProps = {
  lead: Lead;
  canEdit: boolean;
  onEditLead: (lead: Lead) => void;
};

export type LeadsTableProps = {
  leads: Lead[];
  isLoading: boolean;
  canEdit: boolean;
  onEditLead: (lead: Lead) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type ConversionsTableRowProps = {
  conversion: Lead;
};

export type ConversionsTableProps = {
  conversions: Lead[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type LeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: LeadFormValues;
  onFieldChange: <K extends LeadFormField>(
    field: K,
    value: LeadFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type LeadDialogFieldsProps = {
  values: LeadFormValues;
  onFieldChange: <K extends LeadFormField>(
    field: K,
    value: LeadFormValues[K],
  ) => void;
  disabled?: boolean;
};

export type LeadStatusSelectProps = {
  value: LeadStatus;
  onChange: (status: LeadStatus) => void;
  disabled?: boolean;
};

export type LeadSourceSelectProps = {
  value: LeadSource;
  onChange: (source: LeadSource) => void;
  disabled?: boolean;
};

export type LeadScoreSelectProps = {
  value: LeadScore;
  onChange: (score: LeadScore) => void;
  disabled?: boolean;
};
