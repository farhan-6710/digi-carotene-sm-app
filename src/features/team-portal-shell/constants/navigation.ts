import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";
import { crmNav } from "@/features/crm/constants/navigation";
import { LEADS_MANAGEMENT_PATH } from "@/features/crm/constants/routes";
import { growthNav } from "@/features/growth-and-analytics/constants/navigation";
import { projectsNav } from "@/features/projects-management/constants/navigation";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";

export type NavIconKey = ShellNavIconKey;

export type NavItem = {
  label: string;
  to: string;
  icon: NavIconKey;
  children?: { label: string; to: string }[];
};

export const teamBasePath = "/team-portal";

export const primaryNav: NavItem[] = [
  { label: "Dashboard", to: `${teamBasePath}/dashboard`, icon: "dashboard" },
  { label: "Team", to: `${teamBasePath}/team-management`, icon: "team" },
  { label: "Clients", to: `${teamBasePath}/clients-management`, icon: "clients" },
  {
    label: "Projects Management",
    to: PROJECTS_MANAGEMENT_PATH,
    icon: "projects",
    children: projectsNav,
  },
  { label: "Postings Calendar", to: `${teamBasePath}/posts-management`, icon: "posts" },
  {
    label: "Task Management",
    to: `${teamBasePath}/tasks-management`,
    icon: "tasks",
  },
  {
    label: "CRM",
    to: LEADS_MANAGEMENT_PATH,
    icon: "crm",
    children: crmNav,
  },
  {
    label: "Notifications",
    to: `${teamBasePath}/notifications`,
    icon: "notifications",
  },
  { label: "Analytics", to: `${teamBasePath}/analytics`, icon: "analytics" },
  {
    label: "Growth & Analytics",
    to: `${teamBasePath}/growth-and-analytics`,
    icon: "growth",
    children: growthNav,
  },
  { label: "Reports", to: `${teamBasePath}/reports`, icon: "reports" },
  { label: "Account", to: `${teamBasePath}/account`, icon: "account" },
  { label: "Settings", to: `${teamBasePath}/settings`, icon: "settings" },
];

export const appMeta = {
  name: "Digi Carotene",
  portalLabel: "Team Portal",
  userInitials: "D",
} as const;
