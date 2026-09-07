import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  ProductionPlanContent,
  CreateProductionPlanContentInput,
  UpdateProductionPlanContentInput,
} from "@/features/production-planner/types/types";

function toItemColumns(input: CreateProductionPlanContentInput) {
  return {
    production_plan_id: input.productionPlanId,
    item_name: input.itemName,
    shoot_date: input.shootDate || null,
    context_description: input.contextDescription || null,
    content_pillar: input.contentPillar || null,
    script: input.script || null,
    reference_link: input.referenceLink || null,
    manager_approval: input.managerApproval || "pending",
    shoot_incharge_approval: input.shootInchargeApproval || "pending",
    client_approval: input.clientApproval || "pending",
    shoot_completed: input.shootCompleted ?? false,
  };
}

function toItemUpdateColumns(input: UpdateProductionPlanContentInput) {
  const cols: Record<string, unknown> = {};
  if (input.itemName !== undefined) cols.item_name = input.itemName;
  if (input.shootDate !== undefined) cols.shoot_date = input.shootDate;
  if (input.contextDescription !== undefined)
    cols.context_description = input.contextDescription;
  if (input.contentPillar !== undefined) cols.content_pillar = input.contentPillar;
  if (input.script !== undefined) cols.script = input.script;
  if (input.referenceLink !== undefined) cols.reference_link = input.referenceLink;
  if (input.managerApproval !== undefined)
    cols.manager_approval = input.managerApproval;
  if (input.shootInchargeApproval !== undefined)
    cols.shoot_incharge_approval = input.shootInchargeApproval;
  if (input.clientApproval !== undefined)
    cols.client_approval = input.clientApproval;
  if (input.shootCompleted !== undefined)
    cols.shoot_completed = input.shootCompleted;
  return cols;
}

export async function fetchProductionPlanItems(
  productionPlanId: string,
): Promise<ProductionPlanContent[]> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .select(DB.PRODUCTION_PLAN_ITEMS.SELECT)
    .eq("production_plan_id", productionPlanId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }
  return (data ?? []) as ProductionPlanContent[];
}

export async function createProductionPlanItem(
  input: CreateProductionPlanContentInput,
): Promise<ProductionPlanContent> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .insert(toItemColumns(input))
    .select(DB.PRODUCTION_PLAN_ITEMS.SELECT)
    .single();

  if (error) {
    throw error;
  }
  return data as ProductionPlanContent;
}

export async function updateProductionPlanItem(
  id: string,
  input: UpdateProductionPlanContentInput,
): Promise<ProductionPlanContent> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_ITEMS.TABLE)
    .update(toItemUpdateColumns(input))
    .eq("id", id)
    .select(DB.PRODUCTION_PLAN_ITEMS.SELECT)
    .single();

  if (error) {
    throw error;
  }
  return data as ProductionPlanContent;
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
