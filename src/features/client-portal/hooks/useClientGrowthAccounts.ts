import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGrowthAccountsByClientId } from "@/features/growth-and-analytics/hooks/shared/useGrowthAccountsByClientId";

// Client portal: read-only view of the accounts the team linked to this client.
export function useClientGrowthAccounts() {
  const { clientId } = useAuth();
  return useGrowthAccountsByClientId(clientId);
}
