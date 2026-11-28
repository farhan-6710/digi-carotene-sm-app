import type { ClientPortalProjectRow } from "@/features/client-portal/types/types";
import type { PostStatusSelectId } from "@/features/posts-management/constants/postStatusSelect";
import type { Post } from "@/features/posts-management/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import type { TaskSortId } from "@/features/tasks-management/constants/taskSort";
import type { TaskStatusFilterId } from "@/features/tasks-management/constants/taskStatusFilter";
import type { Task } from "@/features/tasks-management/types/types";

export type ClientPostsTableProps = {
  posts: Post[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  statusFilter: PostStatusSelectId;
  onStatusFilterChange: (value: PostStatusSelectId) => void;
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

export type ClientTasksTableProps = {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sort: TaskSortId;
  onSortChange: (sort: TaskSortId) => void;
  statusFilter: TaskStatusFilterId;
  onStatusFilterChange: (filter: TaskStatusFilterId) => void;
};

export type ClientTasksTableRowProps = {
  task: Task;
};

export type ClientProjectTasksSectionProps = {
  projectId: string;
};
