import type {
  ClientFormField,
  ClientFormValues,
} from "@/features/clients-management/utils/clientFormUtils";

import type { Client } from "@/features/clients-management/types/types";

export type ClientOptionSeed = Pick<Client, "id" | "client_name">;

export type ClientsTableRowProps = {
  client: Client;
  canEdit: boolean;
  canDelete?: boolean;
  selected?: boolean;
  onToggleSelect?: (clientId: string) => void;
  onEditClient: (client: Client) => void;
};

export type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ClientFormValues;
  onFieldChange: (field: ClientFormField, value: string) => void;
  onActiveChange: (isActive: boolean) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type ClientsTableProps = {
  clients: import("@/features/clients-management/types/types").Client[];
  isLoading: boolean;
  canEdit: boolean;
  canDelete?: boolean;
  selectedIds?: string[];
  allVisibleSelected?: boolean;
  isDeleting?: boolean;
  onToggleSelect?: (clientId: string) => void;
  onToggleAllVisible?: () => void;
  onClearSelection?: () => void;
  onBulkDelete?: () => void | Promise<void>;
  onEditClient: (client: import("@/features/clients-management/types/types").Client) => void;
  statusFilter: import("@/shared/constants/activeStatusFilter").ActiveStatusFilterId;
  onStatusFilterChange: (
    filter: import("@/shared/constants/activeStatusFilter").ActiveStatusFilterId,
  ) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
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
  seedClient?: ClientOptionSeed | null;
};
