import type { ShellNavIconKey } from "@/shared/constants/shellNavIcons";

export type ClientNavIconKey = Extract<
  ShellNavIconKey,
  "dashboard" | "posts" | "growth" | "account"
>;

export type ClientNavItem = {
  label: string;
  to: string;
  icon: ClientNavIconKey;
};

export const clientNav: ClientNavItem[] = [
  { label: "Dashboard", to: "/client-portal/dashboard", icon: "dashboard" },
  { label: "Posts", to: "/client-portal/posts", icon: "posts" },
  {
    label: "Growth & Analytics",
    to: "/client-portal/growth-and-analytics",
    icon: "growth",
  },
  { label: "Account", to: "/client-portal/account", icon: "account" },
];

export const clientMeta = {
  name: "Digi Carotene",
  portalLabel: "Client Portal",
  userInitials: "DC",
};
