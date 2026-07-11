export type ProjectSocials = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  google?: string;
};

export type ProjectClient = {
  id: string;
  client_name: string;
};

export type ProjectManager = {
  id: string;
  member_name: string;
  team_role: string;
};

export type Project = {
  id: string;
  project_name: string;
  client_id: string;
  socials: ProjectSocials | null;
  manager_id: string;
  created_at: string;
  updated_at: string;
  clients?: ProjectClient | null;
  team_members?: ProjectManager | null;
};

export type ProjectListItem = Project & {
  clients: ProjectClient | null;
  team_members: ProjectManager | null;
  team_member_ids: string[];
};

export type ProjectTeamAssignment = {
  id: string;
  project_id: string;
  member_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  projects: {
    id: string;
    project_name: string;
    client_id: string;
    clients: ProjectClient | null;
  } | null;
};

export type ManagedProject = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  clients: ProjectClient | null;
};
