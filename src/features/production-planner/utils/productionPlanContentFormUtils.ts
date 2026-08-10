import type {
  ProductionPlanContent,
  ProductionPlanApprovalStatus,
} from "@/features/production-planner/types/types";

export type ProductionPlanContentFormValues = {
  contentName: string;
  contentNotes: string;
  managerApproval: ProductionPlanApprovalStatus;
  shootInchargeApproval: ProductionPlanApprovalStatus;
};

export const emptyProductionPlanContentFormValues =
  (): ProductionPlanContentFormValues => ({
    contentName: "",
    contentNotes: "",
    managerApproval: "pending",
    shootInchargeApproval: "pending",
  });

export function contentToFormValues(
  item: ProductionPlanContent,
): ProductionPlanContentFormValues {
  return {
    contentName: item.item_name,
    contentNotes: item.item_notes || "",
    managerApproval: item.manager_approval,
    shootInchargeApproval: item.shoot_incharge_approval,
  };
}

export function validateProductionPlanContentForm(
  values: ProductionPlanContentFormValues,
): string | null {
  if (!values.contentName.trim()) {
    return "Content name is required.";
  }
  return null;
}
