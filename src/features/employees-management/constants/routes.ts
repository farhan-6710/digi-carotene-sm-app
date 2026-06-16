export const EMPLOYEES_MANAGEMENT_PATH = "/admin/employees-management";

export function buildEmployeeDetailPath(employeeId: string): string {
  return `${EMPLOYEES_MANAGEMENT_PATH}/${employeeId}`;
}

/** @deprecated Use EMPLOYEES_MANAGEMENT_PATH */
export const TEAM_MANAGEMENT_PATH = EMPLOYEES_MANAGEMENT_PATH;

/** @deprecated Use buildEmployeeDetailPath */
export const buildTeamMemberDetailPath = buildEmployeeDetailPath;
