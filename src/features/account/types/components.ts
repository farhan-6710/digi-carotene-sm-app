import type { User } from "@supabase/supabase-js";

import type {
  AccountCredential,
  StaffAccount,
} from "@/features/account/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export type AccountCredentialsListProps = {
  credentials: AccountCredential[];
  specializations: string[];
};

export type StaffAccountDetailsCardProps = {
  user: User | null;
  staffAccount: StaffAccount;
  teamRole: TeamMemberRole | null;
};
