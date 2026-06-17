import type { Post } from "@/features/posts-management/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type PortalPostsTableProps = {
  posts: Post[];
  isLoading: boolean;
};

export type PortalPostsTableRowProps = {
  post: Post;
};

export type PortalSocialLinksProps = {
  projects: ProjectListItem[];
};
