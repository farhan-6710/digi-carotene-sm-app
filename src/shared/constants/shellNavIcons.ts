import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  ClipboardCheck,
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
  | "approvals"
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
  approvals: ClipboardCheck,
  account: UserRound,
  settings: Settings,
};
