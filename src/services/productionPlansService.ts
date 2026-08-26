import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import type {
  ProductionPlan,
  ProductionPlanAssignee,
  CreateProductionPlanInput,
  UpdateProductionPlanInput,
} from "@/features/production-planner/types/types";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import { fetchAdminTeamMembers } from "@/services/teamMembersService";
import { seesAllProductionPlans } from "@/shared/utils/rbac";

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
    shoot_date: row.shoot_date,
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
    shoot_date: input.shootDate,
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
  if (input.shootDate !== undefined) cols.shoot_date = input.shootDate;
  if (input.reelsCount !== undefined) cols.reels_count = input.reelsCount;
  if (input.imagesCount !== undefined) cols.images_count = input.imagesCount;
  if (input.carouselsCount !== undefined)
    cols.carousels_count = input.carouselsCount;
  if (input.managerId !== undefined) cols.manager_id = input.managerId;
  if (input.shootInchargeId !== undefined)
    cols.shoot_incharge_id = input.shootInchargeId;
  return cols;
}

/** Keep every admin on the plan team (except plan manager / shoot incharge). */
async function ensureAdminsOnProductionPlan(
  planId: string,
  managerId: string | null | undefined,
  shootInchargeId: string | null | undefined,
): Promise<void> {
  const admins = await fetchAdminTeamMembers();
  if (admins.length === 0) return;

  const roleIds = new Set(
    [managerId, shootInchargeId].filter((id): id is string => Boolean(id)),
  );
  const adminIds = admins.map((admin) => admin.id);

  const { data: existingRows, error } = await supabase
    .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
    .select("id, member_id, ended_at")
    .eq("production_plan_id", planId)
    .in("member_id", adminIds);

  if (error) throw error;

  const rows = existingRows ?? [];

  for (const admin of admins) {
    const memberRows = rows.filter((row) => row.member_id === admin.id);
    const active = memberRows.find((row) => row.ended_at === null);
    const ended = memberRows.find((row) => row.ended_at !== null);

    if (roleIds.has(admin.id)) {
      if (active) {
        await supabase
          .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
          .update({ ended_at: new Date().toISOString() })
          .eq("id", active.id);
      }
      continue;
    }

    if (active) continue;

    if (ended) {
      await supabase
        .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
        .update({ ended_at: null, started_at: new Date().toISOString() })
        .eq("id", ended.id);
    } else {
      await supabase.from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE).insert({
        production_plan_id: planId,
        member_id: admin.id,
      });
    }
  }
}

export async function fetchProductionPlans(): Promise<ProductionPlan[]> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .select(DB.PRODUCTION_PLANS.SELECT)
    .order("shoot_date", { ascending: false });

  if (error) {
    throw error;
  }
  return (data ?? []).map((row) =>
    mapProductionPlanRow(row as unknown as ProductionPlanRow),
  );
}

export async function fetchProductionPlansByClientId(
  clientId: string,
): Promise<ProductionPlan[]> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .select(DB.PRODUCTION_PLANS.SELECT)
    .eq("client_id", clientId)
    .order("shoot_date", { ascending: false });

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

  const plan = mapProductionPlanRow(data as unknown as ProductionPlanRow);
  await ensureAdminsOnProductionPlan(
    plan.id,
    plan.manager_id,
    plan.shoot_incharge_id,
  );
  return plan;
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

  const plan = mapProductionPlanRow(data as unknown as ProductionPlanRow);
  await ensureAdminsOnProductionPlan(
    plan.id,
    plan.manager_id,
    plan.shoot_incharge_id,
  );
  return plan;
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

/** Plan ids where the member is manager, shoot incharge, or an active assignee. */
export async function fetchAssignedProductionPlanIds(
  teamMemberId: string,
): Promise<string[]> {
  const [managedResult, inchargeResult, assignedResult] = await Promise.all([
    supabase
      .from(DB.PRODUCTION_PLANS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
    supabase
      .from(DB.PRODUCTION_PLANS.TABLE)
      .select("id")
      .eq("shoot_incharge_id", teamMemberId),
    supabase
      .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
      .select("production_plan_id")
      .eq("member_id", teamMemberId)
      .is("ended_at", null),
  ]);

  if (managedResult.error) throw managedResult.error;
  if (inchargeResult.error) throw inchargeResult.error;
  if (assignedResult.error) throw assignedResult.error;

  const ids = new Set<string>();
  for (const row of managedResult.data ?? []) ids.add(row.id);
  for (const row of inchargeResult.data ?? []) ids.add(row.id);
  for (const row of assignedResult.data ?? []) ids.add(row.production_plan_id);
  return [...ids];
}

export async function resolveScopedProductionPlanIds(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<string[] | null> {
  if (seesAllProductionPlans(teamRole)) {
    return null;
  }
  if (!teamMemberId) {
    return [];
  }
  return fetchAssignedProductionPlanIds(teamMemberId);
}

async function fetchProductionPlansByIds(
  planIds: string[],
): Promise<ProductionPlan[]> {
  if (planIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .select(DB.PRODUCTION_PLANS.SELECT)
    .in("id", planIds)
    .order("shoot_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    mapProductionPlanRow(row as unknown as ProductionPlanRow),
  );
}

export async function fetchProductionPlansScoped(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<ProductionPlan[]> {
  const scopedIds = await resolveScopedProductionPlanIds(teamRole, teamMemberId);
  if (scopedIds === null) {
    return fetchProductionPlans();
  }
  return fetchProductionPlansByIds(scopedIds);
}
