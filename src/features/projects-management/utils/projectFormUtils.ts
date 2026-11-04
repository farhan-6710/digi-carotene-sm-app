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
  startDate: string;
  etaDate: string;
  committedPosts: string;
  committedImages: string;
  committedCarousels: string;
  committedReels: string;
  isActive: boolean;
};

export type ProjectFormField = keyof Pick<
  ProjectFormValues,
  | "projectName"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "google"
  | "startDate"
  | "etaDate"
  | "committedPosts"
  | "committedImages"
  | "committedCarousels"
  | "committedReels"
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
  startDate: "",
  etaDate: "",
  committedPosts: "0",
  committedImages: "0",
  committedCarousels: "0",
  committedReels: "0",
  isActive: true,
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
    startDate: project.start_date ?? "",
    etaDate: project.eta_date ?? "",
    committedPosts: String(project.committed_posts ?? 0),
    committedImages: String(project.committed_images ?? 0),
    committedCarousels: String(project.committed_carousels ?? 0),
    committedReels: String(project.committed_reels ?? 0),
    isActive: project.is_active ?? true,
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

function parseCommittedCount(value: string, label: string): number | string {
  const trimmed = value.trim();
  if (trimmed === "") return 0;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || String(parsed) !== trimmed) {
    return `${label} must be a whole number 0 or greater.`;
  }
  return parsed;
}

export function parseProjectCommittedCounts(values: ProjectFormValues):
  | {
      committedPosts: number;
      committedImages: number;
      committedCarousels: number;
      committedReels: number;
    }
  | string {
  const committedPosts = parseCommittedCount(values.committedPosts, "Committed posts");
  if (typeof committedPosts === "string") return committedPosts;

  const committedImages = parseCommittedCount(
    values.committedImages,
    "Committed images",
  );
  if (typeof committedImages === "string") return committedImages;

  const committedCarousels = parseCommittedCount(
    values.committedCarousels,
    "Committed carousels",
  );
  if (typeof committedCarousels === "string") return committedCarousels;

  const committedReels = parseCommittedCount(
    values.committedReels,
    "Committed reels",
  );
  if (typeof committedReels === "string") return committedReels;

  return {
    committedPosts,
    committedImages,
    committedCarousels,
    committedReels,
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

  const counts = parseProjectCommittedCounts(values);
  if (typeof counts === "string") {
    return counts;
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
