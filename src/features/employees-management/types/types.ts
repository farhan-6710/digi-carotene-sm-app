import type { EmployeeRole } from "@/features/employees-management/constants/employeeRoles";

export type TeamMember = {
  id: string;
  member_name: string;
  email: string;
  mobile_number: string | null;
  role: EmployeeRole;
  created_at: string;
  updated_at: string;
};

export type MemberAssignmentClient = {
  id: string;
  client_name: string;
  mobile_number: string | null;
  website_name: string | null;
};

export type MemberAssignment = {
  id: string;
  member_id: string;
  client_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  clients: MemberAssignmentClient | null;
};

export type ClientMemberAssignmentMember = {
  id: string;
  member_name: string;
  email: string;
  role: EmployeeRole;
};

export type ClientMemberAssignment = {
  id: string;
  member_id: string;
  client_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  team_members: ClientMemberAssignmentMember | null;
};

/** @deprecated Use TeamMember */
export type Employee = TeamMember;

/** @deprecated Use MemberAssignment */
export type EmployeeAssignment = MemberAssignment;

/** @deprecated Use ClientMemberAssignment */
export type ClientEmployeeAssignment = ClientMemberAssignment;
