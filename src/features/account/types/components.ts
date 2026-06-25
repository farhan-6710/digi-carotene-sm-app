import type { User } from "@supabase/supabase-js";

import type {
  AccountCredential,
  TeamAccount,
} from "@/features/account/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

export type AccountCredentialsListProps = {
  credentials: AccountCredential[];
  specializations: string[];
};

export type TeamAccountDetailsCardProps = {
  user: User | null;
  teamAccount: TeamAccount;
  teamRole: TeamMemberRole | null;
};
