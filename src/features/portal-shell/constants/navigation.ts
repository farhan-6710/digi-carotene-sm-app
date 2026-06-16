export type PortalNavIconKey = "dashboard" | "posts" | "account";

export type PortalNavItem = {
  label: string;
  to: string;
  icon: PortalNavIconKey;
};

export const portalNav: PortalNavItem[] = [
  { label: "Dashboard", to: "/portal/dashboard", icon: "dashboard" },
  { label: "Posts", to: "/portal/posts", icon: "posts" },
  { label: "Account", to: "/portal/account", icon: "account" },
];

export const portalMeta = {
  name: "Digi Carotene",
  portalLabel: "Client Portal",
  userInitials: "DC",
};
