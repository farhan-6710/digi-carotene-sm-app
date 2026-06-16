import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMember } from "@/features/team-management/types/types";

type DbMemberRow = {
  id: string;
  member_name: string;
  email: string;
  mobile_number: string | null;
  role: TeamMemberRole;
  created_at: string;
  updated_at: string;
};

export function mapDbRowToTeamMember(row: DbMemberRow): TeamMember {
  return {
    id: row.id,
    member_name: row.member_name,
    email: row.email,
    mobile_number: row.mobile_number,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
