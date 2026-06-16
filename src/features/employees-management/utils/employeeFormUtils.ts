import {
  DEFAULT_EMPLOYEE_ROLE,
  type EmployeeRole,
} from "@/features/employees-management/constants/employeeRoles";
import type { TeamMember } from "@/features/employees-management/types/types";

export type TeamMemberFormValues = {
  memberName: string;
  email: string;
  mobileNumber: string;
  role: EmployeeRole;
};

export type TeamMemberFormField = keyof TeamMemberFormValues;

export const emptyTeamMemberFormValues = (): TeamMemberFormValues => ({
  memberName: "",
  email: "",
  mobileNumber: "",
  role: DEFAULT_EMPLOYEE_ROLE,
});

export function teamMemberToFormValues(member: TeamMember): TeamMemberFormValues {
  return {
    memberName: member.member_name,
    email: member.email,
    mobileNumber: member.mobile_number ?? "",
    role: member.role,
  };
}

export function validateTeamMemberForm(values: TeamMemberFormValues): string | null {
  if (!values.memberName.trim()) {
    return "Name is required.";
  }

  if (!values.email.trim()) {
    return "Email is required.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(values.email.trim())) {
    return "Enter a valid email address.";
  }

  return null;
}

/** @deprecated Use TeamMemberFormValues */
export type EmployeeFormValues = TeamMemberFormValues;

/** @deprecated Use TeamMemberFormField */
export type EmployeeFormField = TeamMemberFormField;

/** @deprecated Use emptyTeamMemberFormValues */
export const emptyEmployeeFormValues = emptyTeamMemberFormValues;

/** @deprecated Use teamMemberToFormValues */
export const employeeToFormValues = teamMemberToFormValues;

/** @deprecated Use validateTeamMemberForm */
export const validateEmployeeForm = validateTeamMemberForm;
