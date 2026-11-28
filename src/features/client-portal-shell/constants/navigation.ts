import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";
import { CLIENT_SHOOT_BOOKINGS_PATH } from "@/features/client-portal/constants/routes";
import { clientGrowthNav } from "@/features/growth-and-analytics/constants/shared/navigation";

export type ClientNavIconKey = Extract<
  ShellNavIconKey,
  | "dashboard"
  | "posts"
  | "projects"
  | "productionPlanner"
  | "shootBookings"
  | "growth"
  | "account"
  | "tasks"
>;

export type ClientNavItem = {
  label: string;
  to: string;
  icon: ClientNavIconKey;
  children?: { label: string; to: string }[];
};

export const clientNav: ClientNavItem[] = [
  { label: "Dashboard", to: "/client-portal/dashboard", icon: "dashboard" },
  { label: "Projects", to: "/client-portal/projects", icon: "projects" },
  { label: "Posts", to: "/client-portal/posts", icon: "posts" },
  {
    label: "Task Management",
    to: "/client-portal/tasks-management",
    icon: "tasks",
  },
  {
    label: "Production Planner",
    to: "/client-portal/production-planner",
    icon: "productionPlanner",
  },
  {
    label: "Shoot Bookings",
    to: CLIENT_SHOOT_BOOKINGS_PATH,
    icon: "shootBookings",
  },
  {
    label: "Growth & Analytics",
    to: "/client-portal/growth-and-analytics",
    icon: "growth",
    children: clientGrowthNav.map(({ label, to }) => ({ label, to })),
  },
  { label: "Account", to: "/client-portal/account", icon: "account" },
];

export const clientMeta = {
  name: "Digi Carotene",
  portalLabel: "Client Portal",
  userInitials: "DC",
};
