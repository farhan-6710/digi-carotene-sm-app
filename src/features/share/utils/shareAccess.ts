import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export function canGenerateShareLink(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
  managerId: string | null | undefined,
): boolean {
  if (teamRole === "admin") return true;
  return Boolean(teamMemberId && managerId && teamMemberId === managerId);
}
