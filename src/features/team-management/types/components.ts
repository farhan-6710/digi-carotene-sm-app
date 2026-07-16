import type {
  TeamMemberFormField,
  TeamMemberFormValues,
} from "@/features/team-management/utils/teamMemberFormUtils";
import type {
  ManagedProjectSummary,
  MemberProjectAssignment,
  TeamMember,
} from "@/features/team-management/types/types";

export type TeamMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: TeamMemberFormValues;
  onFieldChange: (field: TeamMemberFormField, value: string) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type TeamMembersTableProps = {
  members: TeamMember[];
  isLoading: boolean;
  canEdit: boolean;
  onEditMember: (member: TeamMember) => void;
};

export type TeamMemberDialogFormFieldsProps = {
  values: TeamMemberFormValues;
  onFieldChange: (field: TeamMemberFormField, value: string) => void;
  disabled?: boolean;
};

export type TeamMemberRoleSelectProps = {
  value: TeamMemberFormValues["teamRole"];
  onChange: (teamRole: TeamMemberFormValues["teamRole"]) => void;
  disabled?: boolean;
};

export type TeamMembersTableRowProps = {
  member: TeamMember;
  canEdit: boolean;
  onEditMember: (member: TeamMember) => void;
};

export type TeamMemberProfileCardProps = {
  member: TeamMember;
};

export type TeamMemberActiveProjectsSectionProps = {
  assignments: MemberProjectAssignment[];
  managedProjects: ManagedProjectSummary[];
  isLoading: boolean;
  isSaving: boolean;
  canManage: boolean;
  onAssignClick: () => void;
  onEndAssignment: (assignmentId: string) => void | Promise<void>;
};

export type TeamMemberProjectHistorySectionProps = {
  assignments: MemberProjectAssignment[];
  isLoading: boolean;
};

export type TeamMemberAssignProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeProjectIds: string[];
  isSaving: boolean;
  onAssign: (projectIds: string[]) => void | Promise<void>;
};
