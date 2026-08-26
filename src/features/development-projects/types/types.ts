export type DevProjectClient = {
  id: string;
  client_name: string;
};

export type DevProjectManager = {
  id: string;
  member_name: string;
  team_role: string;
};

export type DevProject = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  description: string | null;
  tech_stack: string | null;
  repo_url: string | null;
  staging_url: string | null;
  production_url: string | null;
  start_date: string | null;
  eta_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clients?: DevProjectClient | null;
  team_members?: DevProjectManager | null;
};

export type DevProjectListItem = DevProject & {
  clients: DevProjectClient | null;
  team_members: DevProjectManager | null;
  team_member_ids: string[];
};

export type CreateDevProjectInput = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds?: string[];
  description?: string | null;
  techStack?: string | null;
  repoUrl?: string | null;
  stagingUrl?: string | null;
  productionUrl?: string | null;
  startDate?: string | null;
  etaDate?: string | null;
};

export type UpdateDevProjectInput = CreateDevProjectInput & {
  isActive?: boolean;
};
