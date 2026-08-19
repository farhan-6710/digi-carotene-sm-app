import type { Post } from "@/features/posts-management/types/types";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";
import {
  mapProductionPlanRow,
  type ProductionPlanRow,
} from "@/services/productionPlansService";
import { mapPostRow, type PostRow } from "@/services/postsService";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import type {
  SharedPlanView,
  SharedProjectView,
} from "@/features/share/types/types";
import {
  buildSharedPlanPath,
  buildSharedProjectPath,
} from "@/features/share/constants/routes";
import { copyTextToClipboard } from "@/shared/utils/copyTextToClipboard";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

type SharedClient = {
  id?: string;
  client_name?: string;
  email?: string | null;
} | null;

async function ensureShareToken(
  table: string,
  entityId: string,
): Promise<string> {
  const { data: existing, error: readError } = await supabase
    .from(table)
    .select("share_token")
    .eq("id", entityId)
    .maybeSingle();

  if (readError) throw readError;
  if (existing?.share_token) return existing.share_token as string;

  const token = crypto.randomUUID();
  const { error } = await supabase
    .from(table)
    .update({ share_token: token })
    .eq("id", entityId);

  if (error) throw error;
  return token;
}

export function buildAbsoluteShareUrl(path: string): string {
  return `${window.location.origin}${path}`;
}

export async function copyProjectShareLink(projectId: string): Promise<void> {
  const token = await ensureShareToken(DB.PROJECTS.TABLE, projectId);
  await copyTextToClipboard(buildAbsoluteShareUrl(buildSharedProjectPath(token)));
}

export async function copyProductionPlanShareLink(planId: string): Promise<void> {
  const token = await ensureShareToken(DB.PRODUCTION_PLANS.TABLE, planId);
  await copyTextToClipboard(buildAbsoluteShareUrl(buildSharedPlanPath(token)));
}

export async function fetchSharedProject(
  token: string,
): Promise<SharedProjectView | null> {
  const { data, error } = await supabase.rpc("fetch_shared_project", {
    p_token: token,
  });
  if (error) throw error;
  if (!data) return null;

  const payload = data as {
    project: Record<string, unknown> | null;
    client: SharedClient;
    manager: ProjectListItem["team_members"];
    posts: PostRow[] | null;
  };
  if (!payload.project) return null;

  const projectRow = payload.project;
  const client = payload.client;
  const project: ProjectListItem = {
    id: String(projectRow.id),
    project_name: String(projectRow.project_name ?? ""),
    client_id: String(projectRow.client_id ?? ""),
    socials: (projectRow.socials as ProjectListItem["socials"]) ?? null,
    manager_id: String(projectRow.manager_id ?? ""),
    is_active: Boolean(projectRow.is_active ?? true),
    created_at: String(projectRow.created_at ?? ""),
    updated_at: String(projectRow.updated_at ?? ""),
    clients: client?.id
      ? { id: client.id, client_name: client.client_name ?? "—" }
      : null,
    team_members: payload.manager?.id ? payload.manager : null,
    team_member_ids: [],
  };

  const nestedProjects = {
    project_name: project.project_name,
    clients: project.clients
      ? { client_name: project.clients.client_name }
      : null,
  };
  const posts: Post[] = (payload.posts ?? []).map((row) =>
    mapPostRow({ ...row, projects: nestedProjects }),
  );

  return {
    project,
    posts,
  };
}

export async function fetchSharedProductionPlan(
  token: string,
): Promise<SharedPlanView | null> {
  const { data, error } = await supabase.rpc("fetch_shared_production_plan", {
    p_token: token,
  });
  if (error) throw error;
  if (!data) return null;

  const payload = data as {
    plan: ProductionPlanRow | null;
    client: SharedClient;
    manager: { id?: string; member_name?: string } | null;
    shoot_incharge: { id?: string; member_name?: string } | null;
    items: ProductionPlanContent[] | null;
  };
  if (!payload.plan) return null;

  const plan = mapProductionPlanRow({
    ...payload.plan,
    clients: payload.client?.id
      ? { id: payload.client.id, client_name: payload.client.client_name ?? "—" }
      : null,
    manager: payload.manager?.id
      ? { id: payload.manager.id, member_name: payload.manager.member_name ?? "—" }
      : null,
    shoot_incharge: payload.shoot_incharge?.id
      ? {
          id: payload.shoot_incharge.id,
          member_name: payload.shoot_incharge.member_name ?? "—",
        }
      : null,
  });

  return {
    plan,
    contents: payload.items ?? [],
  };
}
