import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";
import { growthNav } from "@/features/growth-and-analytics/constants/navigation";

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
    label: "SM Projects Management",
    to: `${teamBasePath}/projects-management`,
    icon: "projects",
  },
  { label: "Postings Calendar", to: `${teamBasePath}/posts-management`, icon: "posts" },
  {
    label: "Task Management",
    to: `${teamBasePath}/tasks-management`,
    icon: "tasks",
  },
  {
    label: "Production Planner",
    to: `${teamBasePath}/production-planner`,
    icon: "productionPlanner",
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
