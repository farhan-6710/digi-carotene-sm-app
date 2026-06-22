import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";

export type NavIconKey = ShellNavIconKey;

export type NavItem = {
  label: string;
  to: string;
  icon: NavIconKey;
};

export const adminBasePath = "/admin";

export const primaryNav: NavItem[] = [
  { label: "Dashboard", to: `${adminBasePath}/dashboard`, icon: "dashboard" },
  { label: "Team", to: `${adminBasePath}/team-management`, icon: "team" },
  { label: "Clients", to: `${adminBasePath}/clients-management`, icon: "clients" },
  { label: "Projects", to: `${adminBasePath}/projects-management`, icon: "projects" },
  { label: "Posts", to: `${adminBasePath}/posts-management`, icon: "posts" },
  { label: "Analytics", to: `${adminBasePath}/analytics`, icon: "analytics" },
  { label: "Reports", to: `${adminBasePath}/reports`, icon: "reports" },
  { label: "Account", to: `${adminBasePath}/account`, icon: "account" },
  { label: "Settings", to: `${adminBasePath}/settings`, icon: "settings" },
];

export const appMeta = {
  name: "Digi Carotene",
  userInitials: "D",
} as const;
