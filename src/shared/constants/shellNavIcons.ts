import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserCog,
  UserRound,
  Users,
} from "lucide-react";

export type ShellNavIconKey =
  | "dashboard"
  | "posts"
  | "projects"
  | "clients"
  | "team"
  | "analytics"
  | "reports"
  | "account"
  | "settings";

export const shellNavIcons: Record<ShellNavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  posts: CalendarClock,
  projects: FolderKanban,
  clients: Users,
  team: UserCog,
  analytics: BarChart3,
  reports: FileText,
  account: UserRound,
  settings: Settings,
};
