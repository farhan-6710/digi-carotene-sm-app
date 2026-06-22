import {
  DEFAULT_TEAM_MEMBER_ROLE,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMember } from "@/features/team-management/types/types";

export type TeamMemberFormValues = {
  memberName: string;
  email: string;
  mobileNumber: string;
  teamRole: TeamMemberRole;
};

export type TeamMemberFormField = keyof TeamMemberFormValues;

export const emptyTeamMemberFormValues = (): TeamMemberFormValues => ({
  memberName: "",
  email: "",
  mobileNumber: "",
  teamRole: DEFAULT_TEAM_MEMBER_ROLE,
});

export function teamMemberToFormValues(member: TeamMember): TeamMemberFormValues {
  return {
    memberName: member.member_name,
    email: member.email,
    mobileNumber: member.mobile_number ?? "",
    teamRole: member.team_role,
  };
}

export function validateTeamMemberForm(values: TeamMemberFormValues): string | null {
  if (!values.memberName.trim()) {
    return "Name is required.";
  }

  if (!values.email.trim()) {
    return "Email is required.";
  }

  return null;
}
