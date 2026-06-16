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

export type ClientProfileCardProps = {
  client: import("@/features/clients-management/types/types").Client;
};

export type ClientComboboxProps = {
  value: string;
  onChange: (clientId: string) => void;
  disabled?: boolean;
  activeClientIds?: string[];
  placeholder?: string;
  preload?: boolean;
};
