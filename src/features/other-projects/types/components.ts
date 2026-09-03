import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type {
  CreateOtherProjectInput,
  OtherProjectListItem,
  UpdateOtherProjectInput,
} from "@/features/other-projects/types/types";
import type { OtherProjectFormValues } from "@/features/other-projects/utils/otherProjectFormUtils";

export type OtherProjectsTableProps = {
  projects: OtherProjectListItem[];
  isLoading: boolean;
  canEdit: boolean;
  onEditProject: (project: OtherProjectListItem) => void;
  statusFilter: ActiveStatusFilterId;
  onStatusFilterChange: (value: ActiveStatusFilterId) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type OtherProjectsTableRowProps = {
  project: OtherProjectListItem;
  canEdit: boolean;
  onEditProject: (project: OtherProjectListItem) => void;
};

export type OtherProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: OtherProjectFormValues;
  formSeeds?: {
    client: { id: string; client_name: string } | null;
    manager: {
      id: string;
      member_name: string;
      team_role: string;
    } | null;
    teamMembers: { id: string; member_name: string }[];
  } | null;
  onFieldChange: <K extends keyof OtherProjectFormValues>(
    field: K,
    value: OtherProjectFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type OtherProjectProfileCardProps = {
  project: OtherProjectListItem;
  hideClientLink?: boolean;
};

export type { CreateOtherProjectInput, UpdateOtherProjectInput };
