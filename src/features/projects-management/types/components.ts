import type { Post } from "@/features/posts-management/types/types";
import type { TeamMember } from "@/features/team-management/types/types";
import type {
  ProjectClient,
  ProjectListItem,
  ProjectManager,
} from "@/features/projects-management/types/types";
import type { ProjectFormValues } from "@/features/projects-management/utils/projectFormUtils";
import type { ProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";

export type ProjectFormSeeds = {
  client: ProjectClient | null;
  manager: ProjectManager | null;
  teamMembers: Pick<TeamMember, "id" | "member_name">[];
};

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
  formSeeds?: ProjectFormSeeds | null;
  onFieldChange: (
    field: keyof Pick<ProjectFormValues, "projectName" | "facebook" | "instagram" | "linkedin" | "youtube" | "google">,
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
  preload?: boolean;
  seedManager?: ProjectManager | null;
};

export type ProjectTeamMembersSelectProps = {
  value: string[];
  onChange: (memberIds: string[]) => void;
  excludeMemberIds?: string[];
  disabled?: boolean;
  preload?: boolean;
  seedMembers?: Pick<TeamMember, "id" | "member_name">[];
};

export type ClientProjectsSectionProps = {
  projects: ProjectListItem[];
  isLoading: boolean;
};

export type ProjectTeamMemberAvatarsProps = {
  members: Pick<TeamMember, "id" | "member_name">[];
};

export type ProjectProfileCardProps = {
  project: ProjectListItem;
  postStats: ProjectPostStats;
  teamMembers: Pick<TeamMember, "id" | "member_name">[];
};

export type ProjectPostsTableProps = {
  posts: Post[];
  isLoading: boolean;
  onEditPost: (post: Post) => void;
};

export type ProjectPostsTableRowProps = {
  post: Post;
  onEditPost: (post: Post) => void;
};

export type ProjectDialogSocialFieldsProps = {
  values: ProjectFormValues;
  onFieldChange: (
    field: "facebook" | "instagram" | "linkedin" | "youtube" | "google",
    value: string,
  ) => void;
  disabled?: boolean;
};
