import type {
  DevProjectListItem,
} from "@/features/development-projects/types/types";

export type DevProjectFormValues = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds: string[];
  description: string;
  techStack: string;
  repoUrl: string;
  stagingUrl: string;
  productionUrl: string;
  startDate: string;
  etaDate: string;
  isActive: boolean;
};

export const emptyDevProjectFormValues = (): DevProjectFormValues => ({
  projectName: "",
  clientId: "",
  managerId: "",
  teamMemberIds: [],
  description: "",
  techStack: "",
  repoUrl: "",
  stagingUrl: "",
  productionUrl: "",
  startDate: "",
  etaDate: "",
  isActive: true,
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
    techStack: project.tech_stack ?? "",
    repoUrl: project.repo_url ?? "",
    stagingUrl: project.staging_url ?? "",
    productionUrl: project.production_url ?? "",
    startDate: project.start_date ?? "",
    etaDate: project.eta_date ?? "",
    isActive: project.is_active ?? true,
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
