import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export function canGenerateShareLink(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
  managerId: string | null | undefined,
): boolean {
  if (teamRole === "admin") return true;
  return Boolean(teamMemberId && managerId && teamMemberId === managerId);
}

export function isAssociatedClient(input: {
  userEmail: string | null | undefined;
  profileClientId: string | null | undefined;
  entityClientId: string | null | undefined;
  clientEmail: string | null | undefined;
}): boolean {
  const { userEmail, profileClientId, entityClientId, clientEmail } = input;
  if (profileClientId && entityClientId && profileClientId === entityClientId) {
    return true;
  }
  const a = userEmail?.trim().toLowerCase();
  const b = clientEmail?.trim().toLowerCase();
  return Boolean(a && b && a === b);
}
