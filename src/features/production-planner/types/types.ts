import type { Client } from "@/features/clients-management/types/types";

export type ProductionPlanApprovalStatus = "pending" | "approved" | "rejected";

export type ProductionPlanAssignee = {
  id: string;
  member_name: string;
};

export type ProductionPlan = {
  id: string;
  client_id: string;
  plan_name: string;
  plan_description: string | null;
  shoot_date: string;
  reels_count: number;
  images_count: number;
  carousels_count: number;
  manager_id: string | null;
  shoot_incharge_id: string | null;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "id" | "client_name"> | null;
  manager?: ProductionPlanAssignee | null;
  shoot_incharge?: ProductionPlanAssignee | null;
};

export type ProductionPlanContent = {
  id: string;
  production_plan_id: string;
  item_name: string;
  item_notes: string | null;
  manager_approval: ProductionPlanApprovalStatus;
  shoot_incharge_approval: ProductionPlanApprovalStatus;
  created_at: string;
  updated_at: string;
};

export type CreateProductionPlanInput = {
  clientId: string;
  planName: string;
  planDescription?: string | null;
  shootDate: string;
  reelsCount: number;
  imagesCount: number;
  carouselsCount: number;
  managerId: string;
  shootInchargeId: string;
};

export type UpdateProductionPlanInput = Partial<CreateProductionPlanInput>;

export type CreateProductionPlanContentInput = {
  productionPlanId: string;
  itemName: string;
  itemNotes?: string | null;
  managerApproval?: ProductionPlanApprovalStatus;
  shootInchargeApproval?: ProductionPlanApprovalStatus;
};

export type UpdateProductionPlanContentInput = Partial<
  Omit<CreateProductionPlanContentInput, "productionPlanId">
>;
