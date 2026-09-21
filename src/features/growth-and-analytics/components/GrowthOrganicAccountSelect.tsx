import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import { GROWTH_ORGANIC_ACCOUNT_PARAM } from "@/features/growth-and-analytics/constants/growthUrlParams";
import {
  ORGANIC_PLATFORM_BADGE_CLASS,
  ORGANIC_PLATFORM_LIST_ORDER,
  organicPlatformLabel,
} from "@/features/growth-and-analytics/constants/growthPlatformConfig";
import { useGrowthSelectedAccount } from "@/features/growth-and-analytics/hooks/useGrowthSelectedAccount";
import { ComboBox } from "@/shared/ui/ComboBox";

import { writeOrganicAccountIdForPlatform } from "../utils/organicAccountSelection";

export function GrowthOrganicAccountSelect() {
  const {
    accounts,
    accountId,
    setAccountId,
    activeAccount,
    isLoading,
  } = useGrowthSelectedAccount();
  const [searchParams] = useSearchParams();

  const options = useMemo(() => {
    const sorted = [...accounts].sort((a, b) => {
      const platformDiff =
        ORGANIC_PLATFORM_LIST_ORDER.indexOf(a.platform) -
        ORGANIC_PLATFORM_LIST_ORDER.indexOf(b.platform);
      if (platformDiff !== 0) return platformDiff;
      return a.accountName.localeCompare(b.accountName);
    });

    return sorted.map((account) => {
      const platformName = organicPlatformLabel(account.platform);
      return {
        value: account.id,
        label: account.accountName,
        group: platformName,
        badge: (
          <span className={ORGANIC_PLATFORM_BADGE_CLASS[account.platform]}>
            {platformName}
          </span>
        ),
      };
    });
  }, [accounts]);

  // When selection comes from sessionStorage (nav dropped `?account=`), put it
  // back in the URL so this page stays shareable / refreshable.
  useEffect(() => {
    if (!accountId) return;
    if (searchParams.get(GROWTH_ORGANIC_ACCOUNT_PARAM) === accountId) return;
    setAccountId(accountId);
  }, [accountId, searchParams, setAccountId]);

  useEffect(() => {
    if (!activeAccount) return;
    writeOrganicAccountIdForPlatform(activeAccount.platform, activeAccount.id);
  }, [activeAccount]);

  return (
    <div className="w-full sm:w-72">
      <ComboBox
        value={accountId}
        onChange={(next) => {
          if (next) setAccountId(next);
        }}
        options={options}
        isLoading={isLoading}
        placeholder="Search accounts..."
        listTitle="Organic accounts"
        emptyMessage="No organic accounts connected yet."
        noMatchMessage="No matching accounts found."
        mode="value"
        disabled={options.length === 0 && !isLoading}
      />
    </div>
  );
}
