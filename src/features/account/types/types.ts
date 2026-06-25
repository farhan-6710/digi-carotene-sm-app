import type { AccountStat } from "@/shared/components/account/types";

export type { AccountStat };

export type AccountCredential = {
  title: string;
  issuer: string;
  year: string;
};

/** Mock admin team account content shown on /admin/account */
export type TeamAccount = {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  licenseNumber: string;
  joinedDate: string;
  location: string;
  bio: string;
  specializations: string[];
  stats: AccountStat[];
  credentials: AccountCredential[];
};
