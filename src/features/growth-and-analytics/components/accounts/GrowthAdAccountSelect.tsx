import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import { GROWTH_AD_ACCOUNT_PARAM } from "@/features/growth-and-analytics/constants/growthUrlParams";
import {
  AD_PLATFORM_BADGE_CLASS,
  AD_PLATFORM_LIST_ORDER,
  adAccountKindLabel,
} from "@/features/growth-and-analytics/constants/growthPlatformConfig";
import { useGrowthSelectedAdAccount } from "@/features/growth-and-analytics/hooks/useGrowthSelectedAdAccount";
import { ComboBox } from "@/shared/ui/ComboBox";

import { writeAdAccountIdForPlatform } from "../utils/adAccountSelection";

export function GrowthAdAccountSelect() {
  const {
    accounts,
    accountId,
    setAccountId,
    activeAccount,
    isLoading,
  } = useGrowthSelectedAdAccount();
  const [searchParams] = useSearchParams();

  const options = useMemo(() => {
    const sorted = [...accounts].sort((a, b) => {
      const platformDiff =
        AD_PLATFORM_LIST_ORDER.indexOf(a.platform) -
        AD_PLATFORM_LIST_ORDER.indexOf(b.platform);
      if (platformDiff !== 0) return platformDiff;
      return a.accountName.localeCompare(b.accountName);
    });

    return sorted.map((account) => {
      const platformName = adAccountKindLabel(account.platform);
      return {
        value: account.id,
        label: `${account.accountName} · ${account.clientName}`,
        group: platformName,
        badge: (
          <span className={AD_PLATFORM_BADGE_CLASS[account.platform]}>
            {platformName}
          </span>
        ),
      };
    });
  }, [accounts]);

  useEffect(() => {
    if (!accountId) return;
    if (searchParams.get(GROWTH_AD_ACCOUNT_PARAM) === accountId) return;
    setAccountId(accountId);
  }, [accountId, searchParams, setAccountId]);

  useEffect(() => {
    if (!activeAccount) return;
    writeAdAccountIdForPlatform(activeAccount.platform, activeAccount.id);
  }, [activeAccount]);

  return (
    <div className="w-full sm:w-80">
      <ComboBox
        value={accountId}
        onChange={(next) => {
          if (next) setAccountId(next);
        }}
        options={options}
        isLoading={isLoading}
        placeholder="Search ad accounts..."
        listTitle="Ad accounts"
        emptyMessage="No ad accounts connected yet."
        noMatchMessage="No matching ad accounts found."
        mode="value"
        disabled={options.length === 0 && !isLoading}
      />
    </div>
  );
}
