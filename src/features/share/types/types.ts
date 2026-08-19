import type { Post } from "@/features/posts-management/types/types";
import type {
  ProductionPlan,
  ProductionPlanContent,
} from "@/features/production-planner/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type SharedProjectView = {
  project: ProjectListItem;
  posts: Post[];
};

export type SharedPlanView = {
  plan: ProductionPlan;
  contents: ProductionPlanContent[];
};
