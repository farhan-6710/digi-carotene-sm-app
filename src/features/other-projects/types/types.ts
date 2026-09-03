export type OtherProjectClient = {
  id: string;
  client_name: string;
};

export type OtherProjectManager = {
  id: string;
  member_name: string;
  team_role: string;
};

export type OtherProject = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  description: string | null;
  start_date: string | null;
  eta_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clients?: OtherProjectClient | null;
  team_members?: OtherProjectManager | null;
};

export type OtherProjectListItem = OtherProject & {
  clients: OtherProjectClient | null;
  team_members: OtherProjectManager | null;
  team_member_ids: string[];
};

export type CreateOtherProjectInput = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds?: string[];
  description?: string | null;
  startDate?: string | null;
  etaDate?: string | null;
};

export type UpdateOtherProjectInput = CreateOtherProjectInput & {
  isActive?: boolean;
};
