import type {
  ProductionPlan,
  ProductionPlanApprovalStatus,
} from "@/features/production-planner/types/types";

export type ProductionPlanFormValues = {
  clientId: string;
  planName: string;
  planDescription: string;
  startDate: string;
  reelsCount: string;
  imagesCount: string;
  carouselsCount: string;
  managerApproval: ProductionPlanApprovalStatus;
  shootInchargeApproval: ProductionPlanApprovalStatus;
};

export const emptyProductionPlanFormValues = (): ProductionPlanFormValues => ({
  clientId: "",
  planName: "",
  planDescription: "",
  startDate: "",
  reelsCount: "0",
  imagesCount: "0",
  carouselsCount: "0",
  managerApproval: "pending",
  shootInchargeApproval: "pending",
});

export function planToFormValues(plan: ProductionPlan): ProductionPlanFormValues {
  return {
    clientId: plan.client_id,
    planName: plan.plan_name,
    planDescription: plan.plan_description || "",
    startDate: plan.start_date,
    reelsCount: String(plan.reels_count),
    imagesCount: String(plan.images_count),
    carouselsCount: String(plan.carousels_count),
    managerApproval: plan.manager_approval,
    shootInchargeApproval: plan.shoot_incharge_approval,
  };
}

export function validateProductionPlanForm(values: ProductionPlanFormValues): string | null {
  if (!values.clientId) {
    return "Please select a client.";
  }
  if (!values.planName.trim()) {
    return "Plan name is required.";
  }
  if (!values.startDate) {
    return "Please select a start date.";
  }

  const reels = parseInt(values.reelsCount, 10);
  const images = parseInt(values.imagesCount, 10);
  const carousels = parseInt(values.carouselsCount, 10);

  if (isNaN(reels) || reels < 0) {
    return "Reels count must be a non-negative number.";
  }
  if (isNaN(images) || images < 0) {
    return "Images count must be a non-negative number.";
  }
  if (isNaN(carousels) || carousels < 0) {
    return "Carousels count must be a non-negative number.";
  }

  return null;
}
