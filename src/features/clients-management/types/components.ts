import type {
  ClientFormField,
  ClientFormValues,
} from "@/features/clients-management/utils/clientFormUtils";

export type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ClientFormValues;
  onFieldChange: (field: ClientFormField, value: string) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type ClientsTableProps = {
  clients: import("@/features/clients-management/types/types").Client[];
  isLoading: boolean;
  onEditClient: (client: import("@/features/clients-management/types/types").Client) => void;
  onDeleteClientClick?: (
    client: import("@/features/clients-management/types/types").Client,
  ) => void;
};

export type ClientDialogBasicFieldsProps = {
  values: ClientFormValues;
  onFieldChange: (field: ClientFormField, value: string) => void;
  disabled?: boolean;
};

export type ClientDialogSocialFieldsProps = ClientDialogBasicFieldsProps;

export type ClientProfileCardProps = {
  client: import("@/features/clients-management/types/types").Client;
};

export type ClientActiveEmployeesSectionProps = {
  assignments: import("@/features/employees-management/types/types").ClientMemberAssignment[];
  isLoading: boolean;
  isSaving: boolean;
  onAssignClick: () => void;
  onEndAssignment: (assignmentId: string) => void | Promise<void>;
};

export type ClientEmployeeHistorySectionProps = {
  assignments: import("@/features/employees-management/types/types").ClientMemberAssignment[];
  isLoading: boolean;
};

export type ClientAssignEmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeMemberIds: string[];
  isSaving: boolean;
  onAssign: (memberId: string) => void | Promise<void>;
};

export type ClientComboboxProps = {
  value: string;
  onChange: (clientId: string) => void;
  disabled?: boolean;
  /** Client ids already actively assigned to the current employee. */
  activeClientIds?: string[];
  placeholder?: string;
  /** Eagerly load options when true (e.g. parent assign dialog is open). */
  preload?: boolean;
};
