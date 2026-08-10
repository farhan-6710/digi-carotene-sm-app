import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  ProductionPlan,
  ProductionPlanAssignee,
  CreateProductionPlanInput,
  UpdateProductionPlanInput,
} from "@/features/production-planner/types/types";

type AssigneeRel =
  | ProductionPlanAssignee
  | ProductionPlanAssignee[]
  | null;

export type ProductionPlanRow = Omit<
  ProductionPlan,
  "clients" | "manager" | "shoot_incharge"
> & {
  clients:
    | { id: string; client_name: string }
    | { id: string; client_name: string }[]
    | null;
  manager: AssigneeRel;
  shoot_incharge: AssigneeRel;
};

function pickRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function mapProductionPlanRow(row: ProductionPlanRow): ProductionPlan {
  const client = pickRelation(row.clients);
  const manager = pickRelation(row.manager);
  const shootIncharge = pickRelation(row.shoot_incharge);

  return {
    id: row.id,
    client_id: row.client_id,
    plan_name: row.plan_name,
    plan_description: row.plan_description,
    start_date: row.start_date,
    reels_count: row.reels_count,
    images_count: row.images_count,
    carousels_count: row.carousels_count,
    manager_id: row.manager_id,
    shoot_incharge_id: row.shoot_incharge_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    clients: client
      ? { id: client.id, client_name: client.client_name }
      : null,
    manager: manager
      ? { id: manager.id, member_name: manager.member_name }
      : null,
    shoot_incharge: shootIncharge
      ? { id: shootIncharge.id, member_name: shootIncharge.member_name }
      : null,
  };
}

function toProductionPlanColumns(input: CreateProductionPlanInput) {
  return {
    client_id: input.clientId,
    plan_name: input.planName,
    plan_description: input.planDescription || null,
    start_date: input.startDate,
    reels_count: input.reelsCount,
    images_count: input.imagesCount,
    carousels_count: input.carouselsCount,
    manager_id: input.managerId,
    shoot_incharge_id: input.shootInchargeId,
  };
}

function toProductionPlanUpdateColumns(input: UpdateProductionPlanInput) {
  const cols: Record<string, unknown> = {};
  if (input.clientId !== undefined) cols.client_id = input.clientId;
  if (input.planName !== undefined) cols.plan_name = input.planName;
  if (input.planDescription !== undefined)
    cols.plan_description = input.planDescription;
  if (input.startDate !== undefined) cols.start_date = input.startDate;
  if (input.reelsCount !== undefined) cols.reels_count = input.reelsCount;
  if (input.imagesCount !== undefined) cols.images_count = input.imagesCount;
  if (input.carouselsCount !== undefined)
    cols.carousels_count = input.carouselsCount;
  if (input.managerId !== undefined) cols.manager_id = input.managerId;
  if (input.shootInchargeId !== undefined)
    cols.shoot_incharge_id = input.shootInchargeId;
  return cols;
}

export async function fetchProductionPlans(): Promise<ProductionPlan[]> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .select(DB.PRODUCTION_PLANS.SELECT)
    .order("start_date", { ascending: false });

  if (error) {
    throw error;
  }
  return (data ?? []).map((row) =>
    mapProductionPlanRow(row as unknown as ProductionPlanRow),
  );
}

export async function fetchProductionPlanById(
  id: string,
): Promise<ProductionPlan | null> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .select(DB.PRODUCTION_PLANS.SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) return null;
  return mapProductionPlanRow(data as unknown as ProductionPlanRow);
}

export async function createProductionPlan(
  input: CreateProductionPlanInput,
): Promise<ProductionPlan> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .insert(toProductionPlanColumns(input))
    .select(DB.PRODUCTION_PLANS.SELECT)
    .single();

  if (error) {
    throw error;
  }
  return mapProductionPlanRow(data as unknown as ProductionPlanRow);
}

export async function updateProductionPlan(
  id: string,
  input: UpdateProductionPlanInput,
): Promise<ProductionPlan> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .update(toProductionPlanUpdateColumns(input))
    .eq("id", id)
    .select(DB.PRODUCTION_PLANS.SELECT)
    .single();

  if (error) {
    throw error;
  }
  return mapProductionPlanRow(data as unknown as ProductionPlanRow);
}

export async function deleteProductionPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
