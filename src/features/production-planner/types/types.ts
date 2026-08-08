import type { Client } from "@/features/clients-management/types/types";

export type ProductionPlanApprovalStatus = "pending" | "approved" | "rejected";

export type ProductionPlan = {
  id: string;
  client_id: string;
  plan_name: string;
  plan_description: string | null;
  start_date: string;
  reels_count: number;
  images_count: number;
  carousels_count: number;
  manager_approval: ProductionPlanApprovalStatus;
  shoot_incharge_approval: ProductionPlanApprovalStatus;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "id" | "client_name"> | null;
};

export type CreateProductionPlanInput = {
  clientId: string;
  planName: string;
  planDescription?: string | null;
  startDate: string;
  reelsCount: number;
  imagesCount: number;
  carouselsCount: number;
  managerApproval?: ProductionPlanApprovalStatus;
  shootInchargeApproval?: ProductionPlanApprovalStatus;
};

export type UpdateProductionPlanInput = Partial<CreateProductionPlanInput>;
