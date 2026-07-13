import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  ClipboardCheck,
  FileBarChart2,
  FileText,
  FolderKanban,
  FolderOpen,
  LayoutDashboard,
  LineChart,
  Megaphone,
  PlugZap,
  Settings,
  TrendingUp,
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
  | "settings"
  | "growth"
  | "contentPerformance"
  | "campaigns"
  | "customReport"
  | "reportLibrary"
  | "manageAccounts";

export const shellNavIcons: Record<ShellNavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  posts: CalendarClock,
  projects: FolderKanban,
  clients: Users,
  team: UserCog,
  analytics: BarChart3,
  growth: TrendingUp,
  reports: FileText,
  approvals: ClipboardCheck,
  account: UserRound,
  settings: Settings,
  contentPerformance: LineChart,
  campaigns: Megaphone,
  customReport: FileBarChart2,
  reportLibrary: FolderOpen,
  manageAccounts: PlugZap,
};
