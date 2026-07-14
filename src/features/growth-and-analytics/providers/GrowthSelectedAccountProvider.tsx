import {
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";

import {
  fetchOrganicAccounts,
  fetchOrganicAccountsByClientId,
} from "@/services/growthAccountsService";
import { fetchInstagramProfiles } from "@/services/instagramProfilesService";
import { useFetch } from "@/shared/hooks/useFetch";

import { GROWTH_ORGANIC_ACCOUNT_PARAM } from "../constants/growthUrlParams";
import type { InstagramProfile, OrganicAccount } from "../types/types";
import { useGrowthAccountsUpdated } from "../hooks/useGrowthAccountsUpdated";
import {
  GrowthSelectedAccountContext,
  type GrowthSelectedAccountContextValue,
} from "./growthSelectedAccountContext";

const NO_ACCOUNTS: OrganicAccount[] = [];
const NO_PROFILES: InstagramProfile[] = [];

export function GrowthSelectedAccountProvider({
  children,
  clientId = null,
}: {
  children: ReactNode;
  /** When set, only organic accounts linked to this client (client portal). */
  clientId?: string | null;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const loadAccounts = useCallback(() => {
    if (clientId) {
      return fetchOrganicAccountsByClientId(clientId);
    }
    return fetchOrganicAccounts();
  }, [clientId]);

  const {
    data: accounts,
    isLoading: isAccountsLoading,
    error: accountsError,
    reload: reloadAccounts,
  } = useFetch(loadAccounts, NO_ACCOUNTS);

  const loadProfiles = useCallback(() => fetchInstagramProfiles(), []);
  const {
    data: profiles,
    isLoading: isProfilesLoading,
    error: profilesError,
    reload: reloadProfiles,
  } = useFetch(loadProfiles, NO_PROFILES);

  const accountParam = searchParams.get(GROWTH_ORGANIC_ACCOUNT_PARAM);

  const activeAccount = useMemo(() => {
    if (accountParam) {
      const selected = accounts.find((account) => account.id === accountParam);
      if (selected) return selected;
    }
    return accounts[0];
  }, [accounts, accountParam]);

  const activeInstagramProfile = useMemo(
    () =>
      activeAccount
        ? profiles.find(
            (profile) => profile.organicAccountId === activeAccount.id,
          )
        : undefined,
    [activeAccount, profiles],
  );

  const setAccountId = useCallback(
    (id: string) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (id) {
            next.set(GROWTH_ORGANIC_ACCOUNT_PARAM, id);
          } else {
            next.delete(GROWTH_ORGANIC_ACCOUNT_PARAM);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useGrowthAccountsUpdated(async () => {
    await reloadAccounts();
    await reloadProfiles();
  });

  const value = useMemo<GrowthSelectedAccountContextValue>(
    () => ({
      accounts,
      accountId: activeAccount?.id ?? "",
      setAccountId,
      activeAccount,
      activeInstagramProfile,
      isLoading: isAccountsLoading || isProfilesLoading,
      error: accountsError ?? profilesError ?? null,
      hasAccounts: accounts.length > 0,
    }),
    [
      accounts,
      activeAccount,
      activeInstagramProfile,
      setAccountId,
      isAccountsLoading,
      isProfilesLoading,
      accountsError,
      profilesError,
    ],
  );

  return (
    <GrowthSelectedAccountContext.Provider value={value}>
      {children}
    </GrowthSelectedAccountContext.Provider>
  );
}
