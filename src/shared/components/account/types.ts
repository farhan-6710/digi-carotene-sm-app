import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export type AccountStat = {
  label: string;
  value: string;
};

export type AccountDetailRow = {
  label: string;
  value: string;
};

export type AccountDetailsCardProps = {
  title: string;
  details: AccountDetailRow[];
};

export type AccountHeaderProps = {
  user: User | null;
  roleLabel: string;
  bio?: string;
  /** When set (including null), shows the internal team member role badge. */
  teamRole?: TeamMemberRole | null;
};

export type AccountPanelCardProps = {
  title: string;
  children: ReactNode;
};

export type AccountStatsGridProps = {
  stats: AccountStat[];
};
