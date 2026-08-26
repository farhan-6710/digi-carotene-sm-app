import type { ClientPortalProjectRow } from "@/features/client-portal/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type ClientPostsTableProps = {
  posts: Post[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type ClientPostsTableRowProps = {
  post: Post;
};

export type ClientSocialLinksProps = {
  projects: ProjectListItem[];
};

export type ClientProjectsTableProps = {
  projects: ClientPortalProjectRow[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type ClientProductionPlansTableProps = {
  plans: ProductionPlan[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};
