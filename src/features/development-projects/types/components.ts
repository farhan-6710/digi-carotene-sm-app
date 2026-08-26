import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type {
  CreateDevProjectInput,
  DevProjectListItem,
  UpdateDevProjectInput,
} from "@/features/development-projects/types/types";
import type { DevProjectFormValues } from "@/features/development-projects/utils/devProjectFormUtils";

export type DevProjectsTableProps = {
  projects: DevProjectListItem[];
  isLoading: boolean;
  canEdit: boolean;
  onEditProject: (project: DevProjectListItem) => void;
  statusFilter: ActiveStatusFilterId;
  onStatusFilterChange: (value: ActiveStatusFilterId) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type DevProjectsTableRowProps = {
  project: DevProjectListItem;
  canEdit: boolean;
  onEditProject: (project: DevProjectListItem) => void;
};

export type DevProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: DevProjectFormValues;
  formSeeds?: {
    client: { id: string; client_name: string } | null;
    manager: {
      id: string;
      member_name: string;
      team_role: string;
    } | null;
    teamMembers: { id: string; member_name: string }[];
  } | null;
  onFieldChange: <K extends keyof DevProjectFormValues>(
    field: K,
    value: DevProjectFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type DevProjectProfileCardProps = {
  project: DevProjectListItem;
  hideClientLink?: boolean;
};

export type { CreateDevProjectInput, UpdateDevProjectInput };
