import type { DevProjectStatusFilterId } from "@/features/development-projects/constants/devProjectStatus";
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
  canDelete?: boolean;
  selectedIds?: string[];
  allVisibleSelected?: boolean;
  isDeleting?: boolean;
  onToggleSelect?: (projectId: string) => void;
  onToggleAllVisible?: () => void;
  onClearSelection?: () => void;
  onBulkDelete?: () => void | Promise<void>;
  onEditProject: (project: DevProjectListItem) => void;
  statusFilter: DevProjectStatusFilterId;
  onStatusFilterChange: (value: DevProjectStatusFilterId) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type DevProjectsTableRowProps = {
  project: DevProjectListItem;
  canEdit: boolean;
  canDelete?: boolean;
  selected?: boolean;
  onToggleSelect?: (projectId: string) => void;
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
