import type {
  Project,
  ProjectListItem,
  ProjectSocials,
} from "@/features/projects-management/types/types";

export type ProjectFormValues = {
  projectName: string;
  clientId: string;
  managerId: string;
  teamMemberIds: string[];
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  google: string;
};

export type ProjectFormField = keyof Pick<
  ProjectFormValues,
  "projectName" | "facebook" | "instagram" | "linkedin" | "youtube" | "google"
>;

export const emptyProjectFormValues = (): ProjectFormValues => ({
  projectName: "",
  clientId: "",
  managerId: "",
  teamMemberIds: [],
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  google: "",
});

export function projectToFormValues(project: ProjectListItem): ProjectFormValues {
  return {
    projectName: project.project_name,
    clientId: project.client_id,
    managerId: project.manager_id,
    teamMemberIds: project.team_member_ids ?? [],
    facebook: project.socials?.facebook ?? "",
    instagram: project.socials?.instagram ?? "",
    linkedin: project.socials?.linkedin ?? "",
    youtube: project.socials?.youtube ?? "",
    google: project.socials?.google ?? "",
  };
}

export function formValuesToSocials(values: ProjectFormValues): ProjectSocials {
  return {
    facebook: values.facebook.trim() || undefined,
    instagram: values.instagram.trim() || undefined,
    linkedin: values.linkedin.trim() || undefined,
    youtube: values.youtube.trim() || undefined,
    google: values.google.trim() || undefined,
  };
}

export function validateProjectForm(values: ProjectFormValues): string | null {
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

export function getProjectDisplayLabel(project: Pick<Project, "project_name"> & {
  clients?: Project["clients"];
}): string {
  const clientName = project.clients?.client_name;
  return clientName
    ? `${project.project_name} (${clientName})`
    : project.project_name;
}
