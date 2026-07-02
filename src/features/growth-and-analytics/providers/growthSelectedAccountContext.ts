import { createContext } from "react";

import type { InstagramProfile, OrganicAccount } from "../types/types";

export type GrowthSelectedAccountContextValue = {
  accounts: OrganicAccount[];
  accountId: string;
  setAccountId: (id: string) => void;
  activeAccount?: OrganicAccount;
  activeInstagramProfile?: InstagramProfile;
  isLoading: boolean;
  error: string | null;
  hasAccounts: boolean;
};

export const GrowthSelectedAccountContext =
  createContext<GrowthSelectedAccountContextValue | null>(null);
