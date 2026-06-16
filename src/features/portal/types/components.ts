import type { Post } from "@/features/posts-management/types/types";

export type PortalPageHeaderProps = {
  title: string;
  highlight?: string;
  description: string;
};

export type PortalPageIntroProps = {
  title: string;
  description: string;
};

export type PortalPostsTableProps = {
  posts: Post[];
  isLoading: boolean;
};

export type PortalSocialLinksProps = {
  projects: import("@/features/projects-management/types/types").ProjectListItem[];
};
