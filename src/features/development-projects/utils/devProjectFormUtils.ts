import type { DevProjectStatus } from "@/features/development-projects/constants/devProjectStatus";
import type { DevProjectListItem } from "@/features/development-projects/types/types";

export type DevProjectFormValues = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds: string[];
  description: string;
  repoUrl: string;
  stagingUrl: string;
  productionUrl: string;
  startDate: string;
  etaDate: string;
  status: DevProjectStatus;
};

export const emptyDevProjectFormValues = (): DevProjectFormValues => ({
  projectName: "",
  clientId: "",
  managerId: "",
  teamMemberIds: [],
  description: "",
  repoUrl: "",
  stagingUrl: "",
  productionUrl: "",
  startDate: "",
  etaDate: "",
  status: "active",
});

export function devProjectToFormValues(
  project: DevProjectListItem,
): DevProjectFormValues {
  return {
    projectName: project.project_name,
    clientId: project.client_id,
    managerId: project.manager_id,
    teamMemberIds: project.team_member_ids ?? [],
    description: project.description ?? "",
    repoUrl: project.repo_url ?? "",
    stagingUrl: project.staging_url ?? "",
    productionUrl: project.production_url ?? "",
    startDate: project.start_date ?? "",
    etaDate: project.eta_date ?? "",
    status: project.status ?? "active",
  };
}

export function validateDevProjectForm(
  values: DevProjectFormValues,
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
