import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";
import type { ProjectListItem } from "@/features/projects-management/types/types";

type CanUseProjectChatInput = {
  project: ProjectListItem;
  teamMemberId?: string | null;
  clientId?: string | null;
  teamRole?: string | null;
};

/** Admin, linked client, manager, or assigned project team member. */
export function canUseProjectChat({
  project,
  teamMemberId,
  clientId,
  teamRole,
}: CanUseProjectChatInput): boolean {
  if (!CHAT_CONFIG.rules.projectChatKinds.includes("sm")) return false;

  if (clientId && project.client_id === clientId) {
    return CHAT_CONFIG.rules.projectChatRoles.includes("client");
  }

  if (!teamMemberId) return false;

  if (teamRole === "admin") {
    return CHAT_CONFIG.rules.projectChatRoles.includes("admin");
  }

  if (project.manager_id === teamMemberId) {
    return CHAT_CONFIG.rules.projectChatRoles.includes("manager");
  }

  if (project.team_member_ids.includes(teamMemberId)) {
    return CHAT_CONFIG.rules.projectChatRoles.includes("team_member");
  }

  return false;
}

export type ProjectChatParticipant = {
  id: string;
  member_name: string;
  kind: "team" | "client";
};

export function buildProjectChatParticipants(input: {
  project: ProjectListItem;
  teamMembers: Array<{ id: string; member_name: string }>;
  excludeId?: string | null;
}): ProjectChatParticipant[] {
  const { project, teamMembers, excludeId } = input;
  const byId = new Map<string, ProjectChatParticipant>();

  const add = (
    id: string | null | undefined,
    name: string | null | undefined,
    kind: "team" | "client",
  ) => {
    if (!id || !name) return;
    if (excludeId && id === excludeId) return;
    if (byId.has(id)) return;
    byId.set(id, { id, member_name: name, kind });
  };

  add(project.team_members?.id, project.team_members?.member_name, "team");
  for (const member of teamMembers) {
    add(member.id, member.member_name, "team");
  }
  add(project.clients?.id, project.clients?.client_name, "client");

  return [...byId.values()].sort((a, b) =>
    a.member_name.localeCompare(b.member_name),
  );
}
