import type {
  TeamMemberFormField,
  TeamMemberFormValues,
} from "@/features/employees-management/utils/employeeFormUtils";
import type { TeamMember } from "@/features/employees-management/types/types";

export type EmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: TeamMemberFormValues;
  onFieldChange: (field: TeamMemberFormField, value: string) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type EmployeesTableProps = {
  employees: TeamMember[];
  isLoading: boolean;
  onEditEmployee: (employee: TeamMember) => void;
};

export type EmployeeDialogFormFieldsProps = {
  values: TeamMemberFormValues;
  onFieldChange: (field: TeamMemberFormField, value: string) => void;
  disabled?: boolean;
};

export type EmployeeRoleSelectProps = {
  value: TeamMemberFormValues["role"];
  onChange: (role: TeamMemberFormValues["role"]) => void;
  disabled?: boolean;
};

export type EmployeesTableRowProps = {
  employee: TeamMember;
  onEditEmployee: (employee: TeamMember) => void;
};

export type EmployeeProfileCardProps = {
  employee: TeamMember;
};

export type EmployeeActiveClientsSectionProps = {
  assignments: import("@/features/employees-management/types/types").MemberAssignment[];
  isLoading: boolean;
  isSaving: boolean;
  onAssignClick: () => void;
  onEndAssignment: (assignmentId: string) => void | Promise<void>;
};

export type EmployeeClientHistorySectionProps = {
  assignments: import("@/features/employees-management/types/types").MemberAssignment[];
  isLoading: boolean;
};

export type EmployeeAssignClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeClientIds: string[];
  isSaving: boolean;
  onAssign: (clientId: string) => void | Promise<void>;
};

export type EmployeeComboboxProps = {
  value: string;
  onChange: (memberId: string) => void;
  disabled?: boolean;
  /** Member ids already actively assigned to the current client. */
  activeEmployeeIds?: string[];
  placeholder?: string;
  /** Eagerly load options when true (e.g. parent assign dialog is open). */
  preload?: boolean;
};
