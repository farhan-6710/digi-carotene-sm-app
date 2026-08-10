import type {
  ProductionPlanItem,
  ProductionPlanApprovalStatus,
} from "@/features/production-planner/types/types";

export type ProductionPlanItemFormValues = {
  itemName: string;
  itemNotes: string;
  managerApproval: ProductionPlanApprovalStatus;
  shootInchargeApproval: ProductionPlanApprovalStatus;
};

export const emptyProductionPlanItemFormValues =
  (): ProductionPlanItemFormValues => ({
    itemName: "",
    itemNotes: "",
    managerApproval: "pending",
    shootInchargeApproval: "pending",
  });

export function itemToFormValues(
  item: ProductionPlanItem,
): ProductionPlanItemFormValues {
  return {
    itemName: item.item_name,
    itemNotes: item.item_notes || "",
    managerApproval: item.manager_approval,
    shootInchargeApproval: item.shoot_incharge_approval,
  };
}

export function validateProductionPlanItemForm(
  values: ProductionPlanItemFormValues,
): string | null {
  if (!values.itemName.trim()) {
    return "Item name is required.";
  }
  return null;
}
