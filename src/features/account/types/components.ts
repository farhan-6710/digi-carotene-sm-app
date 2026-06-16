import type { User } from "@supabase/supabase-js";

import type {
  AccountCredential,
  StaffAccount,
} from "@/features/account/types/types";

export type AccountCredentialsListProps = {
  credentials: AccountCredential[];
  specializations: string[];
};

export type StaffAccountDetailsCardProps = {
  user: User | null;
  staffAccount: StaffAccount;
};
