import type { ContentApprovalFilterId } from "@/features/production-planner/constants/contentApprovalFilters";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";

export function filterContentsByApproval(
  contents: ProductionPlanContent[],
  filter: ContentApprovalFilterId,
): ProductionPlanContent[] {
  if (filter === "all") {
    return contents;
  }

  return contents.filter((content) => {
    const manager = content.manager_approval;
    const shoot = content.shoot_incharge_approval;

    switch (filter) {
      case "both_approved":
        return manager === "approved" && shoot === "approved";
      case "manager_approved_only":
        return manager === "approved" && shoot !== "approved";
      case "shoot_approved_only":
        return shoot === "approved" && manager !== "approved";
      case "manager_approved":
        return manager === "approved";
      case "shoot_approved":
        return shoot === "approved";
      case "pending":
        return manager === "pending" || shoot === "pending";
      case "rejected":
        return manager === "rejected" || shoot === "rejected";
      default:
        return true;
    }
  });
}
