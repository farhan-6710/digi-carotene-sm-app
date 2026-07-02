import { createContext } from "react";

import type { AdAccount } from "../types/types";

export type GrowthSelectedAdAccountContextValue = {
  accounts: AdAccount[];
  accountId: string;
  setAccountId: (id: string) => void;
  activeAccount?: AdAccount;
  isLoading: boolean;
  error: string | null;
  hasAccounts: boolean;
};

export const GrowthSelectedAdAccountContext =
  createContext<GrowthSelectedAdAccountContextValue | null>(null);
