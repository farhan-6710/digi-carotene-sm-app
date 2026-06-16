export type NavIconKey =
  | "dashboard"
  | "posts"
  | "projects"
  | "clients"
  | "team"
  | "analytics"
  | "reports"
  | "account"
  | "settings";

export type NavItem = {
  label: string;
  to: string;
  icon: NavIconKey;
};

export const adminBasePath = "/admin";

export const primaryNav: NavItem[] = [
  { label: "Dashboard", to: `${adminBasePath}/dashboard`, icon: "dashboard" },
  {
    label: "Posts",
    to: `${adminBasePath}/posts-management`,
    icon: "posts",
  },
  {
    label: "Projects",
    to: `${adminBasePath}/projects-management`,
    icon: "projects",
  },
  {
    label: "Clients",
    to: `${adminBasePath}/clients-management`,
    icon: "clients",
  },
  {
    label: "Team",
    to: `${adminBasePath}/team-management`,
    icon: "team",
  },
  { label: "Analytics", to: `${adminBasePath}/analytics`, icon: "analytics" },
  { label: "Reports", to: `${adminBasePath}/reports`, icon: "reports" },
  { label: "Account", to: `${adminBasePath}/account`, icon: "account" },
  { label: "Settings", to: `${adminBasePath}/settings`, icon: "settings" },
];

export const appMeta = {
  name: "Digi Carotene",
  userInitials: "D",
} as const;
