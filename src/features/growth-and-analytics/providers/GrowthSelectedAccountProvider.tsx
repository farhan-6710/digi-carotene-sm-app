import {
  useCallback,
  useEffect,
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

import {
  GROWTH_ORGANIC_ACCOUNT_PARAM,
  GROWTH_ORGANIC_ACCOUNT_STORAGE_KEY,
} from "../constants/growthUrlParams";
import type { InstagramProfile, OrganicAccount } from "../types/types";
import { useGrowthAccountsUpdated } from "../hooks/useGrowthAccountsUpdated";
import {
  GrowthSelectedAccountContext,
  type GrowthSelectedAccountContextValue,
} from "./growthSelectedAccountContext";

const NO_ACCOUNTS: OrganicAccount[] = [];
const NO_PROFILES: InstagramProfile[] = [];

function readStoredOrganicAccountId(): string | null {
  try {
    return sessionStorage.getItem(GROWTH_ORGANIC_ACCOUNT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredOrganicAccountId(id: string | null): void {
  try {
    if (id) {
      sessionStorage.setItem(GROWTH_ORGANIC_ACCOUNT_STORAGE_KEY, id);
    } else {
      sessionStorage.removeItem(GROWTH_ORGANIC_ACCOUNT_STORAGE_KEY);
    }
  } catch {
    // Private mode / blocked storage — URL param still works on the same page.
  }
}

function resolveOrganicAccount(
  accounts: OrganicAccount[],
  accountParam: string | null,
): OrganicAccount | undefined {
  if (accountParam) {
    const fromUrl = accounts.find((account) => account.id === accountParam);
    if (fromUrl) return fromUrl;
  }

  const storedId = readStoredOrganicAccountId();
  if (storedId) {
    const fromStorage = accounts.find((account) => account.id === storedId);
    if (fromStorage) return fromStorage;
  }

  return accounts[0];
}

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

  const activeAccount = useMemo(
    () => resolveOrganicAccount(accounts, accountParam),
    [accounts, accountParam],
  );

  // Keep storage in sync so Dashboard ↔ Content Performance keep the same account
  // even when sidebar links drop `?account=`.
  useEffect(() => {
    if (activeAccount?.id) {
      writeStoredOrganicAccountId(activeAccount.id);
    }
  }, [activeAccount?.id]);

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
      writeStoredOrganicAccountId(id || null);
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
