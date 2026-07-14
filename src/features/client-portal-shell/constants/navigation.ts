import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";
import { clientGrowthNav } from "@/features/growth-and-analytics/constants/navigation";

export type ClientNavIconKey = Extract<
  ShellNavIconKey,
  "dashboard" | "posts" | "growth" | "account"
>;

export type ClientNavItem = {
  label: string;
  to: string;
  icon: ClientNavIconKey;
  children?: { label: string; to: string }[];
};

export const clientNav: ClientNavItem[] = [
  { label: "Dashboard", to: "/client-portal/dashboard", icon: "dashboard" },
  { label: "Posts", to: "/client-portal/posts", icon: "posts" },
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
