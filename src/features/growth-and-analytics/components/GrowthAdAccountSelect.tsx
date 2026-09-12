import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import { GROWTH_AD_ACCOUNT_PARAM } from "@/features/growth-and-analytics/constants/growthUrlParams";
import { useGrowthSelectedAdAccount } from "@/features/growth-and-analytics/hooks/useGrowthSelectedAdAccount";
import { ComboBox } from "@/shared/ui/ComboBox";

import { GrowthAdsPlatformToggle } from "./GrowthAdsPlatformToggle";
import type { AdsAccountKind } from "../types/types";
import {
  pickAdAccountForPlatform,
  writeAdAccountIdForPlatform,
} from "../utils/adAccountSelection";

export function GrowthAdAccountSelect() {
  const {
    accounts,
    accountId,
    setAccountId,
    activeAccount,
    isLoading,
  } = useGrowthSelectedAdAccount();
  const [searchParams] = useSearchParams();

  const availablePlatforms = useMemo(() => {
    const platforms = new Set<AdsAccountKind>();
    for (const account of accounts) {
      platforms.add(account.platform);
    }
    return [...platforms];
  }, [accounts]);

  const platform: AdsAccountKind =
    activeAccount?.platform ?? availablePlatforms[0] ?? "meta_ads";

  const options = useMemo(
    () =>
      accounts
        .filter((account) => account.platform === platform)
        .map((account) => ({
          value: account.id,
          label: `${account.accountName} · ${account.clientName}`,
        })),
    [accounts, platform],
  );

  useEffect(() => {
    if (!accountId) return;
    if (searchParams.get(GROWTH_AD_ACCOUNT_PARAM) === accountId) return;
    setAccountId(accountId);
  }, [accountId, searchParams, setAccountId]);

  useEffect(() => {
    if (!activeAccount) return;
    writeAdAccountIdForPlatform(activeAccount.platform, activeAccount.id);
  }, [activeAccount]);

  const handlePlatformChange = (nextPlatform: AdsAccountKind) => {
    if (nextPlatform === platform) return;
    const nextAccount = pickAdAccountForPlatform(accounts, nextPlatform);
    if (!nextAccount) return;
    setAccountId(nextAccount.id);
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
      <GrowthAdsPlatformToggle
        value={platform}
        onChange={handlePlatformChange}
        availablePlatforms={availablePlatforms}
        disableUnavailable
      />
      <div className="w-full sm:w-72">
        <ComboBox
          value={accountId}
          onChange={(next) => {
            if (next) setAccountId(next);
          }}
          options={options}
          isLoading={isLoading}
          placeholder={
            platform === "google_ads"
              ? "Select Google Ads account"
              : "Select Meta ad account"
          }
          listTitle={
            platform === "google_ads" ? "Google Ads accounts" : "Meta ad accounts"
          }
          emptyMessage={
            platform === "google_ads"
              ? "No Google Ads accounts connected yet."
              : "No Meta ad accounts connected yet."
          }
          noMatchMessage="No matching ad accounts found."
          mode="value"
          disabled={options.length === 0 && !isLoading}
        />
      </div>
    </div>
  );
}
