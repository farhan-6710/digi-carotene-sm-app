import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  MemberPlanAssignment,
  MemberPlanRoleAssignment,
} from "@/features/team-management/types/types";

type AssignmentRow = MemberPlanAssignment & {
  production_plans:
    | MemberPlanAssignment["production_plans"]
    | MemberPlanAssignment["production_plans"][];
};

type PlanRoleRow = {
  id: string;
  plan_name: string;
  client_id: string;
  clients:
    | { id: string; client_name: string }
    | { id: string; client_name: string }[]
    | null;
};

function pickRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function normalizeAssignment(row: AssignmentRow): MemberPlanAssignment {
  return { ...row, production_plans: pickRelation(row.production_plans) };
}

function mapRoleRow(
  row: PlanRoleRow,
  role: MemberPlanRoleAssignment["role"],
): MemberPlanRoleAssignment {
  return {
    id: row.id,
    plan_name: row.plan_name,
    client_id: row.client_id,
    role,
    clients: pickRelation(row.clients),
  };
}

export async function fetchMemberPlanAssignments(
  memberId: string,
): Promise<MemberPlanAssignment[]> {
  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
    .select(DB.PRODUCTION_PLAN_TEAM_MEMBERS.SELECT)
    .eq("member_id", memberId)
    .order("started_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    normalizeAssignment(row as unknown as AssignmentRow),
  );
}

export async function fetchMemberPlanRoleAssignments(
  memberId: string,
): Promise<MemberPlanRoleAssignment[]> {
  const select = "id, plan_name, client_id, clients ( id, client_name )";
  const [managerResult, inchargeResult] = await Promise.all([
    supabase
      .from(DB.PRODUCTION_PLANS.TABLE)
      .select(select)
      .eq("manager_id", memberId)
      .order("plan_name", { ascending: true }),
    supabase
      .from(DB.PRODUCTION_PLANS.TABLE)
      .select(select)
      .eq("shoot_incharge_id", memberId)
      .order("plan_name", { ascending: true }),
  ]);

  if (managerResult.error) throw managerResult.error;
  if (inchargeResult.error) throw inchargeResult.error;

  return [
    ...(managerResult.data ?? []).map((row) =>
      mapRoleRow(row as unknown as PlanRoleRow, "manager"),
    ),
    ...(inchargeResult.data ?? []).map((row) =>
      mapRoleRow(row as unknown as PlanRoleRow, "shoot_incharge"),
    ),
  ];
}

export async function assignMemberToProductionPlan(
  memberId: string,
  planId: string,
): Promise<MemberPlanAssignment> {
  const { data: plan, error: planError } = await supabase
    .from(DB.PRODUCTION_PLANS.TABLE)
    .select("manager_id, shoot_incharge_id")
    .eq("id", planId)
    .maybeSingle();

  if (planError) {
    throw planError;
  }

  if (!plan) {
    throw new Error("Production plan not found.");
  }

  if (plan.manager_id === memberId) {
    throw new Error("This member is already the plan manager.");
  }

  if (plan.shoot_incharge_id === memberId) {
    throw new Error("This member is already the shoot incharge.");
  }

  const { data, error } = await supabase
    .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
    .insert({ production_plan_id: planId, member_id: memberId })
    .select(DB.PRODUCTION_PLAN_TEAM_MEMBERS.SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "This team member is already actively assigned to this plan.",
      );
    }
    throw new Error(error.message ?? "Failed to save assignment.");
  }

  return normalizeAssignment(data as unknown as AssignmentRow);
}

export async function endProductionPlanAssignment(
  assignmentId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.PRODUCTION_PLAN_TEAM_MEMBERS.TABLE)
    .update({ ended_at: new Date().toISOString() })
    .eq("id", assignmentId)
    .is("ended_at", null);

  if (error) {
    throw new Error(error.message ?? "Failed to end assignment.");
  }
}
