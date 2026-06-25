import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { isPassedPostingTime } from "@/features/post-approvals/utils/postDateTimeUtils";

export function requiresBackdatedPostApproval(
  teamRole: TeamMemberRole | null,
  postingDateTime: { date: string; time: string },
): boolean {
  if (teamRole !== "executive") {
    return false;
  }

  return isPassedPostingTime(postingDateTime.date, postingDateTime.time);
}

export function canReviewPostApprovalRequest(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
  projectManagerId: string,
): boolean {
  if (!teamMemberId || !teamRole) {
    return false;
  }

  if (teamRole === "admin") {
    return true;
  }

  return teamMemberId === projectManagerId;
}

export function canAccessApprovalsNav(
  teamRole: TeamMemberRole | null,
  managesAnyProject: boolean,
): boolean {
  if (teamRole === "admin") {
    return true;
  }

  return teamRole === "manager" && managesAnyProject;
}
