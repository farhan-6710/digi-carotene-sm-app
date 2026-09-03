import type { OtherProjectListItem } from "@/features/other-projects/types/types";

export type OtherProjectFormValues = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds: string[];
  description: string;
  startDate: string;
  etaDate: string;
  isActive: boolean;
};

export const emptyOtherProjectFormValues = (): OtherProjectFormValues => ({
  projectName: "",
  clientId: "",
  managerId: "",
  teamMemberIds: [],
  description: "",
  startDate: "",
  etaDate: "",
  isActive: true,
});

export function otherProjectToFormValues(
  project: OtherProjectListItem,
): OtherProjectFormValues {
  return {
    projectName: project.project_name,
    clientId: project.client_id,
    managerId: project.manager_id,
    teamMemberIds: project.team_member_ids ?? [],
    description: project.description ?? "",
    startDate: project.start_date ?? "",
    etaDate: project.eta_date ?? "",
    isActive: project.is_active ?? true,
  };
}

export function validateOtherProjectForm(
  values: OtherProjectFormValues,
): string | null {
  if (!values.projectName.trim()) {
    return "Project name is required.";
  }
  if (!values.clientId) {
    return "Client is required.";
  }
  if (!values.managerId) {
    return "Manager is required.";
  }
  return null;
}

export function trimOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
