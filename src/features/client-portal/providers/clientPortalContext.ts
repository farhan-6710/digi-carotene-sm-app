import { createContext } from "react";

import type { Client } from "@/features/clients-management/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type ClientPortalContextValue = {
  client: Client | null;
  projects: ProjectListItem[];
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const ClientPortalContext = createContext<ClientPortalContextValue | null>(
  null,
);
