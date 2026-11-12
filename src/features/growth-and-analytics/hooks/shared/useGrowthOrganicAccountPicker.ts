import { useGrowthSelectedAccount } from "./useGrowthSelectedAccount";

/** @deprecated Use useGrowthSelectedAccount — kept for existing hook imports. */
export function useGrowthOrganicAccountPicker() {
  const selected = useGrowthSelectedAccount();

  return {
    accountOptions: selected.accounts.map((account) => ({
      value: account.id,
      label: `${account.accountName} (${account.platform === "instagram" ? "Instagram" : "Facebook"})`,
    })),
    accountId: selected.accountId,
    setAccountId: selected.setAccountId,
    activeAccount: selected.activeAccount,
    activeInstagramProfile: selected.activeInstagramProfile,
    isAccountsLoading: selected.isLoading,
    accountsError: selected.error,
    hasAccounts: selected.hasAccounts,
    reloadProfiles: async () => {},
  };
}
