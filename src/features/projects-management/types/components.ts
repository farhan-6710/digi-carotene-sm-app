import type { ProjectFormValues } from "@/features/projects-management/utils/projectFormUtils";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type ProjectsTableRowProps = {
  project: ProjectListItem;
  canEdit: boolean;
  onEditProject: (project: ProjectListItem) => void;
};

export type ProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ProjectFormValues;
  onFieldChange: (
    field: keyof Pick<ProjectFormValues, "projectName" | "facebook" | "instagram" | "linkedin" | "youtube">,
    value: string,
  ) => void;
  onClientChange: (clientId: string) => void;
  onManagerChange: (managerId: string) => void;
  onTeamMemberIdsChange: (teamMemberIds: string[]) => void;
  onSave: () => void;
  onDelete?: () => void;
};

export type ProjectsTableProps = {
  projects: ProjectListItem[];
  isLoading: boolean;
  canEdit: boolean;
  onEditProject: (project: ProjectListItem) => void;
};

export type ProjectComboboxProps = {
  value: string;
  onChange: (projectId: string) => void;
  disabled?: boolean;
  activeProjectIds?: string[];
  placeholder?: string;
  preload?: boolean;
};

export type ProjectManagerSelectProps = {
  value: string;
  onChange: (managerId: string) => void;
  disabled?: boolean;
};

export type ProjectTeamMembersSelectProps = {
  value: string[];
  onChange: (memberIds: string[]) => void;
  excludeMemberIds?: string[];
  disabled?: boolean;
};

export type ClientProjectsSectionProps = {
  projects: ProjectListItem[];
  isLoading: boolean;
};

export type ProjectDialogSocialFieldsProps = {
  values: ProjectFormValues;
  onFieldChange: (
    field: "facebook" | "instagram" | "linkedin" | "youtube",
    value: string,
  ) => void;
  disabled?: boolean;
};
