import {
  GROWTH_AD_ACCOUNT_BY_PLATFORM_STORAGE_KEY,
} from "../constants/growthUrlParams";
import type { AdAccount, AdsAccountKind } from "../types/types";

export type AdAccountIdByPlatform = Partial<Record<AdsAccountKind, string>>;

export function readAdAccountIdByPlatform(): AdAccountIdByPlatform {
  try {
    const raw = sessionStorage.getItem(
      GROWTH_AD_ACCOUNT_BY_PLATFORM_STORAGE_KEY,
    );
    if (!raw) return {};
    return JSON.parse(raw) as AdAccountIdByPlatform;
  } catch {
    return {};
  }
}

export function writeAdAccountIdForPlatform(
  platform: AdsAccountKind,
  accountId: string,
): void {
  try {
    const next = {
      ...readAdAccountIdByPlatform(),
      [platform]: accountId,
    };
    sessionStorage.setItem(
      GROWTH_AD_ACCOUNT_BY_PLATFORM_STORAGE_KEY,
      JSON.stringify(next),
    );
  } catch {
    // ignore
  }
}

/** Prefer last picked account for this ads platform; otherwise the first one. */
export function pickAdAccountForPlatform(
  accounts: AdAccount[],
  platform: AdsAccountKind,
): AdAccount | undefined {
  const forPlatform = accounts.filter(
    (account) => account.platform === platform,
  );
  if (forPlatform.length === 0) return undefined;

  const rememberedId = readAdAccountIdByPlatform()[platform];
  if (rememberedId) {
    const remembered = forPlatform.find(
      (account) => account.id === rememberedId,
    );
    if (remembered) return remembered;
  }

  return forPlatform[0];
}
