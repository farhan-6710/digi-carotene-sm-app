export const TEAM_MANAGEMENT_PATH = "/team-portal/team-management";

export function buildTeamMemberDetailPath(memberId: string): string {
  return `${TEAM_MANAGEMENT_PATH}/${memberId}`;
}
