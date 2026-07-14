import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  AdAccount,
  OrganicAccount,
} from "@/features/growth-and-analytics/types/types";
import {
  fetchAdAccountsByClientId,
  fetchOrganicAccountsByClientId,
} from "@/services/growthAccountsService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientGrowthAccounts = {
  organic: OrganicAccount[];
  ads: AdAccount[];
};

const EMPTY: ClientGrowthAccounts = { organic: [], ads: [] };

// Client portal: read-only view of the accounts the team linked to this client.
export function useClientGrowthAccounts() {
  const { clientId } = useAuth();

  const load = useCallback(async (): Promise<ClientGrowthAccounts> => {
    if (!clientId) {
      return EMPTY;
    }

    const [organic, ads] = await Promise.all([
      fetchOrganicAccountsByClientId(clientId),
      fetchAdAccountsByClientId(clientId),
    ]);

    return { organic, ads };
  }, [clientId]);

  const { data, isLoading, error } = useFetch<ClientGrowthAccounts>(load, EMPTY);

  const hasOrganic = data.organic.length > 0;
  const hasAds = data.ads.length > 0;

  return {
    organic: data.organic,
    ads: data.ads,
    hasOrganic,
    hasAds,
    hasAccounts: hasOrganic || hasAds,
    isLoading,
    error,
  };
}
