import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import { GROWTH_ORGANIC_ACCOUNT_PARAM } from "@/features/growth-and-analytics/constants/growthUrlParams";
import { useGrowthSelectedAccount } from "@/features/growth-and-analytics/hooks/useGrowthSelectedAccount";
import { ComboBox } from "@/shared/ui/ComboBox";

import { GrowthOrganicPlatformToggle } from "./GrowthOrganicPlatformToggle";
import type { GrowthPlatform } from "../types/types";
import {
  pickOrganicAccountForPlatform,
  writeOrganicAccountIdForPlatform,
} from "../utils/organicAccountSelection";

export function GrowthOrganicAccountSelect() {
  const {
    accounts,
    accountId,
    setAccountId,
    activeAccount,
    isLoading,
  } = useGrowthSelectedAccount();
  const [searchParams] = useSearchParams();

  const availablePlatforms = useMemo(() => {
    const platforms = new Set<GrowthPlatform>();
    for (const account of accounts) {
      platforms.add(account.platform);
    }
    return [...platforms];
  }, [accounts]);

  const platform: GrowthPlatform =
    activeAccount?.platform ?? availablePlatforms[0] ?? "instagram";

  const options = useMemo(
    () =>
      accounts
        .filter((account) => account.platform === platform)
        .map((account) => ({
          value: account.id,
          label: account.accountName,
        })),
    [accounts, platform],
  );

  // When selection comes from sessionStorage (nav dropped `?account=`), put it
  // back in the URL so this page stays shareable / refreshable.
  useEffect(() => {
    if (!accountId) return;
    if (searchParams.get(GROWTH_ORGANIC_ACCOUNT_PARAM) === accountId) return;
    setAccountId(accountId);
  }, [accountId, searchParams, setAccountId]);

  // Remember last pick per platform for tab switches.
  useEffect(() => {
    if (!activeAccount) return;
    writeOrganicAccountIdForPlatform(activeAccount.platform, activeAccount.id);
  }, [activeAccount]);

  const handlePlatformChange = (nextPlatform: GrowthPlatform) => {
    if (nextPlatform === platform) return;
    const nextAccount = pickOrganicAccountForPlatform(accounts, nextPlatform);
    if (!nextAccount) return;
    setAccountId(nextAccount.id);
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
      <GrowthOrganicPlatformToggle
        value={platform}
        onChange={handlePlatformChange}
        availablePlatforms={availablePlatforms}
      />
      <div className="w-full sm:w-64">
        <ComboBox
          value={accountId}
          onChange={(next) => {
            if (next) setAccountId(next);
          }}
          options={options}
          isLoading={isLoading}
          placeholder={
            platform === "facebook" ? "Select Facebook Page" : "Select Instagram"
          }
          listTitle={
            platform === "facebook" ? "Facebook Pages" : "Instagram accounts"
          }
          emptyMessage={
            platform === "facebook"
              ? "No Facebook Pages connected yet."
              : "No Instagram accounts connected yet."
          }
          noMatchMessage="No matching accounts found."
          mode="value"
          disabled={options.length === 0 && !isLoading}
        />
      </div>
    </div>
  );
}
