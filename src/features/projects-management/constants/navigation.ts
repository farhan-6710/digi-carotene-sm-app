import type { ShellNavSubItem } from "@/shared/types/components";

import { DEV_PROJECTS_MANAGEMENT_PATH } from "@/features/development-projects/constants/routes";
import { OTHER_PROJECTS_MANAGEMENT_PATH } from "@/features/other-projects/constants/routes";
import { PRODUCTION_PLANNER_PATH } from "@/features/production-planner/constants/routes";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";

export const projectsNav: ShellNavSubItem[] = [
  { label: "Social Media Projects", to: PROJECTS_MANAGEMENT_PATH },
  { label: "Development Projects", to: DEV_PROJECTS_MANAGEMENT_PATH },
  { label: "Other Projects", to: OTHER_PROJECTS_MANAGEMENT_PATH },
  { label: "Production Planner", to: PRODUCTION_PLANNER_PATH },
];
