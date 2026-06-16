import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export type TeamMember = {
  id: string;
  member_name: string;
  email: string;
  mobile_number: string | null;
  role: TeamMemberRole;
  created_at: string;
  updated_at: string;
};

export type MemberProjectAssignment = {
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
    clients: { id: string; client_name: string } | null;
  } | null;
};

export type ManagedProjectSummary = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  clients: { id: string; client_name: string } | null;
};
