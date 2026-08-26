import type { ShellNavSubItem } from "@/shared/types/components";

import { DEV_PROJECTS_MANAGEMENT_PATH } from "@/features/development-projects/constants/routes";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";

export const projectsNav: ShellNavSubItem[] = [
  { label: "Social Media Projects", to: PROJECTS_MANAGEMENT_PATH },
  { label: "Development Projects", to: DEV_PROJECTS_MANAGEMENT_PATH },
];
