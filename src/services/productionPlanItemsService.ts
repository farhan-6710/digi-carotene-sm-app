import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  ProductionPlanItem,
  CreateProductionPlanItemInput,
  UpdateProductionPlanItemInput,
} from "@/features/production-planner/types/types";

function toItemColumns(input: CreateProductionPlanItemInput) {
  return {
    production_plan_id: input.productionPlanId,
    item_name: input.itemName,
    item_notes: input.itemNotes || null,
    manager_approval: input.managerApproval || "pending",
    shoot_incharge_approval: input.shootInchargeApproval || "pending",
  };
}

function toItemUpdateColumns(input: UpdateProductionPlanItemInput) {
  const cols: Record<string, unknown> = {};
  if (input.itemName !== undefined) cols.item_name = input.itemName;
  if (input.itemNotes !== undefined) cols.item_notes = input.itemNotes;
  if (input.managerApproval !== undefined)
    cols.manager_approval = input.managerApproval;
  if (input.shootInchargeApproval !== undefined)
    cols.shoot_incharge_approval = input.shootInchargeApproval;
  return cols;
}

export async function fetchProductionPlanItems(
  productionPlanId: string,
): Promise<ProductionPlanItem[]> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .select(DB.PRODUCTION_PLAN_ITEMS.SELECT)
    .eq("production_plan_id", productionPlanId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }
  return (data ?? []) as ProductionPlanItem[];
}

export async function createProductionPlanItem(
  input: CreateProductionPlanItemInput,
): Promise<ProductionPlanItem> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .insert(toItemColumns(input))
    .select(DB.PRODUCTION_PLAN_ITEMS.SELECT)
    .single();

  if (error) {
    throw error;
  }
  return data as ProductionPlanItem;
}

export async function updateProductionPlanItem(
  id: string,
  input: UpdateProductionPlanItemInput,
): Promise<ProductionPlanItem> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .update(toItemUpdateColumns(input))
    .eq("id", id)
    .select(DB.PRODUCTION_PLAN_ITEMS.SELECT)
    .single();

  if (error) {
    throw error;
  }
  return data as ProductionPlanItem;
}

export async function deleteProductionPlanItem(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
