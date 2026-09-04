import { useMemo } from "react";

import { useGrowthSelectedAdAccount } from "@/features/growth-and-analytics/hooks/useGrowthSelectedAdAccount";
import { ComboBox } from "@/shared/ui/ComboBox";

export function GrowthAdAccountSelect() {
  const {
    accounts,
    accountId,
    setAccountId,
    isLoading,
    hasAccounts,
  } = useGrowthSelectedAdAccount();

  const options = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: `${account.accountName} · ${account.clientName}`,
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
        placeholder="Select ad account"
        listTitle="Ad accounts"
        emptyMessage="No ad accounts connected yet."
        noMatchMessage="No matching ad accounts found."
        mode="value"
        disabled={!hasAccounts && !isLoading}
      />
    </div>
  );
}
