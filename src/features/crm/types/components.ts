import type {
  LeadFormField,
  LeadFormValues,
} from "@/features/crm/utils/leadFormUtils";
import type { LeadFollowUpFilterId } from "@/features/crm/constants/leadFollowUpFilters";
import type { LeadSortId } from "@/features/crm/constants/leadSort";
import type {
  CreateLeadFollowUpInput,
  CrmSheetActivity,
  Lead,
  LeadFollowUp,
  LeadFollowUpStatus,
  LeadScore,
  LeadSource,
  LeadStatus,
} from "@/features/crm/types/types";
import type { LeadFollowUpFormValues } from "@/features/crm/utils/leadFollowUpFormUtils";

export type LeadsTableRowProps = {
  lead: Lead;
  nextFollowUp: LeadFollowUp | null;
  canEdit: boolean;
  isSavingFollowUp?: boolean;
  onEditLead: (lead: Lead) => void;
  onUpdateFollowUpStatus: (
    followUpId: string,
    status: LeadFollowUpStatus,
  ) => Promise<void>;
  onRescheduleFollowUp: (
    followUpId: string,
    input: CreateLeadFollowUpInput,
  ) => Promise<void>;
};

export type LeadSortSelectProps = {
  value: LeadSortId;
  onChange: (sort: LeadSortId) => void;
  disabled?: boolean;
};

export type LeadMonthFilterProps = {
  value: string;
  onChange: (monthKey: string) => void;
  disabled?: boolean;
};

export type LeadFollowUpFilterSelectProps = {
  value: LeadFollowUpFilterId;
  onChange: (filter: LeadFollowUpFilterId) => void;
  disabled?: boolean;
};

export type LeadFollowUpStatusSelectProps = {
  value: LeadFollowUpStatus;
  onChange: (status: LeadFollowUpStatus) => void;
  disabled?: boolean;
};

export type LeadFollowUpBadgeProps = {
  kind: "overdue" | "upcoming" | LeadFollowUpStatus;
};

export type LeadFollowUpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: LeadFollowUpFormValues;
  onFieldChange: <K extends keyof LeadFollowUpFormValues>(
    field: K,
    value: LeadFollowUpFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type LeadFollowUpsSectionProps = {
  followUps: LeadFollowUp[];
  canEdit: boolean;
  isSaving?: boolean;
  onSave: (
    followUpId: string | null,
    input: CreateLeadFollowUpInput,
  ) => Promise<void>;
  onDelete: (followUpId: string) => Promise<void>;
};

export type LeadFollowUpCellProps = {
  followUp: LeadFollowUp | null;
  canEdit: boolean;
  isSaving?: boolean;
  onUpdateStatus: (
    followUpId: string,
    status: LeadFollowUpStatus,
  ) => Promise<void>;
  onReschedule: (
    followUpId: string,
    input: CreateLeadFollowUpInput,
  ) => Promise<void>;
};

export type LeadsTableProps = {
  leads: Lead[];
  followUpsByLeadId: Map<string, LeadFollowUp[]>;
  isLoading: boolean;
  canEdit: boolean;
  isSavingFollowUp?: boolean;
  onEditLead: (lead: Lead) => void;
  onUpdateFollowUpStatus: (
    followUpId: string,
    status: LeadFollowUpStatus,
  ) => Promise<void>;
  onRescheduleFollowUp: (
    followUpId: string,
    input: CreateLeadFollowUpInput,
  ) => Promise<void>;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sort: LeadSortId;
  onSortChange: (sort: LeadSortId) => void;
  monthFilter: string;
  onMonthFilterChange: (monthKey: string) => void;
  followUpFilter: LeadFollowUpFilterId;
  onFollowUpFilterChange: (filter: LeadFollowUpFilterId) => void;
};

export type ContactTableRowProps = {
  contact: Lead;
};

export type ContactTableProps = {
  contacts: Lead[];
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

export type LeadProfileCardProps = {
  lead: Lead;
};

export type LeadAddressCardProps = {
  address: string | null;
  canEdit: boolean;
  isSaving?: boolean;
  onSave: (address: string) => Promise<void>;
};

export type LeadNotesSectionProps = {
  notes: import("@/features/crm/types/types").LeadNote[];
  canEdit: boolean;
  isSaving?: boolean;
  onAdd: (body: string) => Promise<void>;
  onSave: (
    note: import("@/features/crm/types/types").LeadNote,
    body: string,
  ) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
};

export type LeadAttachmentsSectionProps = {
  attachments: import("@/features/crm/types/types").LeadAttachment[];
  canEdit: boolean;
  isSaving?: boolean;
  onAdd: (
    input: import("@/features/crm/types/types").CreateLeadAttachmentInput,
  ) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
};

export type LeadActivitiesSectionProps = {
  tasks: import("@/features/crm/types/types").LeadTask[];
  meetings: import("@/features/crm/types/types").LeadMeeting[];
  calls: import("@/features/crm/types/types").LeadCall[];
  canEdit: boolean;
  isSaving?: boolean;
  showAddNew?: boolean;
  onSaveTask: (
    taskId: string | null,
    input: import("@/features/crm/types/types").CreateLeadTaskInput,
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onSaveMeeting: (
    meetingId: string | null,
    input: import("@/features/crm/types/types").CreateLeadMeetingInput,
  ) => Promise<void>;
  onDeleteMeeting: (meetingId: string) => Promise<void>;
  onSaveCall: (
    callId: string | null,
    input: import("@/features/crm/types/types").CreateLeadCallInput,
  ) => Promise<void>;
  onDeleteCall: (callId: string) => Promise<void>;
};

export type CrmActivitiesSheetListProps = {
  onNavigate: () => void;
};

export type CrmActivitySheetGroupProps = {
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  items: CrmSheetActivity[];
  emptyMessage: string;
  onNavigate: () => void;
};

export type CrmActivitySheetRowProps = {
  activity: CrmSheetActivity;
  onNavigate: () => void;
};
