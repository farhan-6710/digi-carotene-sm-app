import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import type { ProjectKind } from "@/features/projects-management/utils/projectKindUtils";

export type TeamMember = {
  id: string;
  member_name: string;
  email: string;
  mobile_number: string | null;
  team_role: TeamMemberRole;
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
  project_kind: ProjectKind;
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
  project_kind: ProjectKind;
  clients: { id: string; client_name: string } | null;
};

export type MemberPlanAssignment = {
  id: string;
  production_plan_id: string;
  member_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  production_plans: {
    id: string;
    plan_name: string;
    client_id: string;
    clients: { id: string; client_name: string } | null;
  } | null;
};

export type MemberPlanRoleAssignment = {
  id: string;
  plan_name: string;
  client_id: string;
  role: "manager" | "shoot_incharge";
  clients: { id: string; client_name: string } | null;
};
