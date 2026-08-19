import type { ProductionPlan } from "@/features/production-planner/types/types";

export type ProductionPlanFormValues = {
  clientId: string;
  planName: string;
  planDescription: string;
  shootDate: string;
  reelsCount: string;
  imagesCount: string;
  carouselsCount: string;
  managerId: string;
  shootInchargeId: string;
};

export const emptyProductionPlanFormValues = (): ProductionPlanFormValues => ({
  clientId: "",
  planName: "",
  planDescription: "",
  shootDate: "",
  reelsCount: "0",
  imagesCount: "0",
  carouselsCount: "0",
  managerId: "",
  shootInchargeId: "",
});

export function planToFormValues(plan: ProductionPlan): ProductionPlanFormValues {
  return {
    clientId: plan.client_id,
    planName: plan.plan_name,
    planDescription: plan.plan_description || "",
    shootDate: plan.shoot_date,
    reelsCount: String(plan.reels_count),
    imagesCount: String(plan.images_count),
    carouselsCount: String(plan.carousels_count),
    managerId: plan.manager_id ?? "",
    shootInchargeId: plan.shoot_incharge_id ?? "",
  };
}

export function validateProductionPlanForm(
  values: ProductionPlanFormValues,
): string | null {
  if (!values.clientId) {
    return "Please select a client.";
  }
  if (!values.planName.trim()) {
    return "Plan name is required.";
  }
  if (!values.shootDate) {
    return "Please select a shoot date.";
  }
  if (!values.managerId) {
    return "Please select a manager.";
  }
  if (!values.shootInchargeId) {
    return "Please select a shoot incharge.";
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

export function formatPlanDeliverables(plan: ProductionPlan): string {
  return [
    plan.reels_count > 0
      ? `${plan.reels_count} reel${plan.reels_count > 1 ? "s" : ""}`
      : null,
    plan.images_count > 0
      ? `${plan.images_count} image${plan.images_count > 1 ? "s" : ""}`
      : null,
    plan.carousels_count > 0
      ? `${plan.carousels_count} carousel${plan.carousels_count > 1 ? "s" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getProductionPlanDisplayLabel(plan: ProductionPlan): string {
  const clientName = plan.clients?.client_name;
  return clientName ? `${plan.plan_name} (${clientName})` : plan.plan_name;
}
