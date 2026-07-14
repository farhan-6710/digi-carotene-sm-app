import {
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";

import {
  fetchAdAccounts,
  fetchAdAccountsByClientId,
} from "@/services/growthAccountsService";
import { useFetch } from "@/shared/hooks/useFetch";

import { GROWTH_AD_ACCOUNT_PARAM } from "../constants/growthUrlParams";
import type { AdAccount } from "../types/types";
import { useGrowthAccountsUpdated } from "../hooks/useGrowthAccountsUpdated";
import {
  GrowthSelectedAdAccountContext,
  type GrowthSelectedAdAccountContextValue,
} from "./growthSelectedAdAccountContext";

const NO_ACCOUNTS: AdAccount[] = [];

export function GrowthSelectedAdAccountProvider({
  children,
  clientId = null,
}: {
  children: ReactNode;
  /** When set, only ad accounts linked to this client (client portal). */
  clientId?: string | null;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const loadAccounts = useCallback(() => {
    if (clientId) {
      return fetchAdAccountsByClientId(clientId);
    }
    return fetchAdAccounts();
  }, [clientId]);

  const {
    data: accounts,
    isLoading,
    error,
    reload,
  } = useFetch(loadAccounts, NO_ACCOUNTS);

  const accountParam = searchParams.get(GROWTH_AD_ACCOUNT_PARAM);

  const activeAccount = useMemo(() => {
    if (accountParam) {
      const selected = accounts.find((account) => account.id === accountParam);
      if (selected) return selected;
    }
    return accounts[0];
  }, [accounts, accountParam]);

  const setAccountId = useCallback(
    (id: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (id) {
            next.set(GROWTH_AD_ACCOUNT_PARAM, id);
          } else {
            next.delete(GROWTH_AD_ACCOUNT_PARAM);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useGrowthAccountsUpdated(reload);

  const value = useMemo<GrowthSelectedAdAccountContextValue>(
    () => ({
      accounts,
      accountId: activeAccount?.id ?? "",
      setAccountId,
      activeAccount,
      isLoading,
      error: error ?? null,
      hasAccounts: accounts.length > 0,
    }),
    [accounts, activeAccount, setAccountId, isLoading, error],
  );

  return (
    <GrowthSelectedAdAccountContext.Provider value={value}>
      {children}
    </GrowthSelectedAdAccountContext.Provider>
  );
}
