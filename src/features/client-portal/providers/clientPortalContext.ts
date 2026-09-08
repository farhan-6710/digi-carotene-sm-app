import { createContext } from "react";

import type { Client } from "@/features/clients-management/types/types";
import type { DevProjectListItem } from "@/features/development-projects/types/types";
import type { OtherProjectListItem } from "@/features/other-projects/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type ClientPortalContextValue = {
  client: Client | null;
  projects: ProjectListItem[];
  devProjects: DevProjectListItem[];
  otherProjects: OtherProjectListItem[];
  posts: Post[];
  productionPlans: ProductionPlan[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const ClientPortalContext = createContext<ClientPortalContextValue | null>(
  null,
);
