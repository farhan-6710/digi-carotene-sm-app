import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";
import type {
  ChatInboxSnapshot,
  ChatInboxThread,
  ChatMentionItem,
} from "@/features/chat/types/types";
import { buildClientProjectDetailPath } from "@/features/client-portal/constants/routes";
import { buildClientTaskDetailPath } from "@/features/client-portal/constants/taskRoutes";
import { buildProjectDetailPath } from "@/features/projects-management/constants/routes";
import { buildTaskDetailPath } from "@/features/tasks-management/constants/routes";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

type Actor = {
  teamMemberId?: string | null;
  clientId?: string | null;
  isClientPortal?: boolean;
};

function taskHref(taskId: string, isClientPortal: boolean): string {
  return isClientPortal
    ? buildClientTaskDetailPath(taskId)
    : buildTaskDetailPath(taskId);
}

function projectHref(projectId: string, isClientPortal: boolean): string {
  return isClientPortal
    ? buildClientProjectDetailPath(projectId)
    : buildProjectDetailPath(projectId);
}

function uniqueLatestThreads(
  rows: Array<{
    threadId: string;
    title: string;
    preview: string;
    updatedAt: string;
    href: string;
    kind: "task" | "project";
  }>,
): ChatInboxThread[] {
  const byId = new Map<string, ChatInboxThread>();
  for (const row of rows) {
    const existing = byId.get(row.threadId);
    if (existing && existing.updatedAt >= row.updatedAt) continue;
    byId.set(row.threadId, {
      id: row.threadId,
      kind: row.kind,
      title: row.title,
      preview: row.preview,
      updatedAt: row.updatedAt,
      href: row.href,
    });
  }
  return [...byId.values()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export async function fetchChatInbox(actor: Actor): Promise<ChatInboxSnapshot> {
  const teamMemberId = actor.teamMemberId?.trim() || null;
  const clientId = actor.clientId?.trim() || null;
  const isClientPortal = Boolean(actor.isClientPortal);
  const limit = CHAT_CONFIG.inboxPageSize;

  if (!teamMemberId && !clientId) {
    return { projectThreads: [], taskThreads: [], mentions: [] };
  }

  const authorFilter = teamMemberId
    ? { column: "author_team_member_id", value: teamMemberId }
    : { column: "author_client_id", value: clientId as string };
  const mentionColumn = teamMemberId
    ? "mentioned_team_member_ids"
    : "mentioned_client_ids";
  const mentionValue = teamMemberId ?? (clientId as string);

  const [taskAuthored, projectAuthored, taskMentions, projectMentions] =
    await Promise.all([
      supabase
        .from(DB.TASK_MESSAGES.TABLE)
        .select("task_id, body, created_at, tasks!inner(id, title)")
        .eq(authorFilter.column, authorFilter.value)
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from(DB.PROJECT_MESSAGES.TABLE)
        .select(
          "sm_project_id, body, created_at, sm_projects!inner(id, project_name)",
        )
        .eq(authorFilter.column, authorFilter.value)
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from(DB.TASK_MESSAGES.TABLE)
        .select("id, task_id, body, created_at, tasks!inner(id, title)")
        .contains(mentionColumn, [mentionValue])
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from(DB.PROJECT_MESSAGES.TABLE)
        .select(
          "id, sm_project_id, body, created_at, sm_projects!inner(id, project_name)",
        )
        .contains(mentionColumn, [mentionValue])
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

  if (taskAuthored.error) throw taskAuthored.error;
  if (projectAuthored.error) throw projectAuthored.error;
  if (taskMentions.error) throw taskMentions.error;
  if (projectMentions.error) throw projectMentions.error;

  type TaskJoin = { id: string; title: string };
  type ProjectJoin = { id: string; project_name: string };

  const taskThreads = uniqueLatestThreads(
    (taskAuthored.data ?? []).map((row) => {
      const task = row.tasks as unknown as TaskJoin | TaskJoin[];
      const t = Array.isArray(task) ? task[0] : task;
      return {
        threadId: row.task_id as string,
        title: t?.title ?? "Task",
        preview: (row.body as string) ?? "",
        updatedAt: row.created_at as string,
        href: taskHref(row.task_id as string, isClientPortal),
        kind: "task" as const,
      };
    }),
  );

  const projectThreads = uniqueLatestThreads(
    (projectAuthored.data ?? []).map((row) => {
      const project = row.sm_projects as unknown as ProjectJoin | ProjectJoin[];
      const p = Array.isArray(project) ? project[0] : project;
      return {
        threadId: row.sm_project_id as string,
        title: p?.project_name ?? "Project",
        preview: (row.body as string) ?? "",
        updatedAt: row.created_at as string,
        href: projectHref(row.sm_project_id as string, isClientPortal),
        kind: "project" as const,
      };
    }),
  );

  const mentions: ChatMentionItem[] = [
    ...(taskMentions.data ?? []).map((row) => {
      const task = row.tasks as unknown as TaskJoin | TaskJoin[];
      const t = Array.isArray(task) ? task[0] : task;
      return {
        id: row.id as string,
        kind: "task" as const,
        title: t?.title ?? "Task",
        body: (row.body as string) ?? "",
        createdAt: row.created_at as string,
        href: taskHref(row.task_id as string, isClientPortal),
      };
    }),
    ...(projectMentions.data ?? []).map((row) => {
      const project = row.sm_projects as unknown as ProjectJoin | ProjectJoin[];
      const p = Array.isArray(project) ? project[0] : project;
      return {
        id: row.id as string,
        kind: "project" as const,
        title: p?.project_name ?? "Project",
        body: (row.body as string) ?? "",
        createdAt: row.created_at as string,
        href: projectHref(row.sm_project_id as string, isClientPortal),
      };
    }),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { projectThreads, taskThreads, mentions };
}
