export const TEAM_MEMBER_ROLES = ["executive", "manager", "admin"] as const;

export type TeamMemberRole = (typeof TEAM_MEMBER_ROLES)[number];

export const TEAM_MEMBER_ROLE_LABELS: Record<TeamMemberRole, string> = {
  executive: "Executive",
  manager: "Manager",
  admin: "Admin",
};

export const TEAM_MEMBER_ROLE_BADGE_CLASS: Record<TeamMemberRole, string> = {
  executive: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  manager: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  admin: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export const DEFAULT_TEAM_MEMBER_ROLE: TeamMemberRole = "executive";
