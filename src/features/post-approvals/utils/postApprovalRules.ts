import {
  normalizeTeamMemberRole,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";
import { isPassedPostingTime } from "@/features/post-approvals/utils/postDateTimeUtils";

export function requiresBackdatedPostApproval(
  teamRole: TeamMemberRole | string | null,
  postingDateTime: { date: string; time: string },
): boolean {
  if (normalizeTeamMemberRole(teamRole) !== "sm_executive") {
    return false;
  }

  return isPassedPostingTime(postingDateTime.date, postingDateTime.time);
}

export function canReviewPostApprovalRequest(
  teamRole: TeamMemberRole | string | null,
  teamMemberId: string | null,
  projectManagerId: string,
): boolean {
  const role = normalizeTeamMemberRole(teamRole);
  if (!teamMemberId || !role) {
    return false;
  }

  if (role === "admin") {
    return true;
  }

  return teamMemberId === projectManagerId;
}

export function canAccessApprovalsSection(
  teamRole: TeamMemberRole | string | null,
  managesAnyProject: boolean,
): boolean {
  const role = normalizeTeamMemberRole(teamRole);
  if (role === "admin") {
    return true;
  }

  return role === "manager" && managesAnyProject;
}
