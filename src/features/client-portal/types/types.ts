import type { ProjectSocials } from "@/features/projects-management/types/types";
import type { ProjectKind } from "@/features/projects-management/utils/projectKindUtils";

export type ClientPortalProjectRow = {
  id: string;
  project_name: string;
  project_kind: ProjectKind;
  manager_name: string | null;
  is_active: boolean;
  socials: ProjectSocials | null;
  detailPath: string;
};
