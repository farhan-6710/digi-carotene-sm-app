import { DEFAULT_POST_TYPE } from "@/features/posts-management/constants/postsManagement";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";

/** Shoot-completed content that has not been moved to the postings calendar yet. */
export function canMoveContentToPosts(content: ProductionPlanContent): boolean {
  return content.shoot_completed && !content.moved_to_post_id;
}

export function getContentPostScheduleDate(
  content: ProductionPlanContent,
  planShootDate: string,
): string | null {
  return content.shoot_date?.trim() || planShootDate.trim() || null;
}

export function getDefaultContentPostType() {
  return DEFAULT_POST_TYPE;
}
