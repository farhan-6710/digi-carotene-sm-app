import { Briefcase, FolderKanban, UserRound, UserX } from "lucide-react";

import type {
  CategoryDatum,
  EntityPostBreakdown,
  LabeledValue,
} from "@/features/analytics/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import {
  TEAM_MEMBER_ROLES,
  TEAM_MEMBER_ROLE_LABELS,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMember } from "@/features/team-management/types/types";
import type { StatCardItem } from "@/shared/types/statsCards";

const ROLE_COLORS: Record<TeamMemberRole, string> = {
  executive: "var(--chart-1)",
  manager: "var(--chart-3)",
  admin: "var(--chart-4)",
};

export function buildRoleDistribution(members: TeamMember[]): CategoryDatum[] {
  return TEAM_MEMBER_ROLES.map((role) => ({
    key: role,
    label: TEAM_MEMBER_ROLE_LABELS[role],
    value: members.filter((member) => member.team_role === role).length,
    color: ROLE_COLORS[role],
  })).filter((entry) => entry.value > 0);
}

export function buildManagerWorkload(
  posts: Post[],
  projects: ProjectListItem[],
  members: TeamMember[],
): EntityPostBreakdown[] {
  const managerByProject = new Map(
    projects.map((project) => [project.id, project.manager_id]),
  );
  const nameById = new Map(members.map((member) => [member.id, member.member_name]));
  const projectCountByManager = new Map<string, number>();

  for (const project of projects) {
    projectCountByManager.set(
      project.manager_id,
      (projectCountByManager.get(project.manager_id) ?? 0) + 1,
    );
  }

  const rows = new Map<string, EntityPostBreakdown>();

  for (const post of posts) {
    const managerId = managerByProject.get(post.project_id);
    if (!managerId) {
      continue;
    }

    const row = rows.get(managerId) ?? {
      id: managerId,
      name: nameById.get(managerId) ?? "Unknown manager",
      meta: `${projectCountByManager.get(managerId) ?? 0} projects`,
      total: 0,
      posted: 0,
      scheduled: 0,
      notPosted: 0,
    };

    row.total += 1;
    if (post.status === "Posted") row.posted += 1;
    else if (post.status === "Scheduled") row.scheduled += 1;
    else row.notPosted += 1;

    rows.set(managerId, row);
  }

  return [...rows.values()].sort(
    (a, b) => b.total - a.total || a.name.localeCompare(b.name),
  );
}

export function buildManagerWorkloadChart(
  workload: EntityPostBreakdown[],
  limit = 8,
): LabeledValue[] {
  return workload
    .slice(0, limit)
    .map((row) => ({ label: row.name, value: row.total }));
}

export function buildTeamStatCards(
  members: TeamMember[],
  projects: ProjectListItem[],
): StatCardItem[] {
  const assignedIds = new Set<string>();
  for (const project of projects) {
    assignedIds.add(project.manager_id);
    for (const memberId of project.team_member_ids) {
      assignedIds.add(memberId);
    }
  }

  const managersCount = new Set(projects.map((project) => project.manager_id)).size;
  const unassigned = members.filter((member) => !assignedIds.has(member.id)).length;

  return [
    {
      id: "team-total",
      label: "Team Members",
      value: String(members.length),
      description: "People on the team",
      icon: UserRound,
    },
    {
      id: "team-managers",
      label: "Active Managers",
      value: String(managersCount),
      description: "Members managing projects",
      icon: Briefcase,
    },
    {
      id: "team-projects",
      label: "Active Projects",
      value: String(projects.length),
      description: "Projects in progress",
      icon: FolderKanban,
    },
    {
      id: "team-unassigned",
      label: "Unassigned",
      value: String(unassigned),
      description: "Members without a project",
      icon: UserX,
      trend: unassigned > 0 ? "negative" : "positive",
    },
  ];
}
