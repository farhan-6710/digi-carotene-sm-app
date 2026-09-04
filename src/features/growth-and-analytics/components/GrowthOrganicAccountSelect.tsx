import { useMemo } from "react";

import { organicPlatformLabel } from "@/features/growth-and-analytics/constants/growthPlatformConfig";
import { useGrowthSelectedAccount } from "@/features/growth-and-analytics/hooks/useGrowthSelectedAccount";
import { ComboBox } from "@/shared/ui/ComboBox";

export function GrowthOrganicAccountSelect() {
  const {
    accounts,
    accountId,
    setAccountId,
    isLoading,
    hasAccounts,
  } = useGrowthSelectedAccount();

  const options = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: `${account.accountName} · ${organicPlatformLabel(account.platform)}`,
      })),
    [accounts],
  );

  return (
    <div className="w-full sm:w-72">
      <ComboBox
        value={accountId}
        onChange={(next) => {
          if (next) setAccountId(next);
        }}
        options={options}
        isLoading={isLoading}
        placeholder="Select account"
        listTitle="Organic accounts"
        emptyMessage="No accounts connected yet."
        noMatchMessage="No matching accounts found."
        mode="value"
        disabled={!hasAccounts && !isLoading}
      />
    </div>
  );
}
