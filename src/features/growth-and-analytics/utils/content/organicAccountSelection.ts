import {
  GROWTH_ORGANIC_ACCOUNT_BY_PLATFORM_STORAGE_KEY,
} from "../constants/growthUrlParams";
import type { GrowthPlatform, OrganicAccount } from "../types/types";

export type OrganicAccountIdByPlatform = Partial<
  Record<GrowthPlatform, string>
>;

export function readOrganicAccountIdByPlatform(): OrganicAccountIdByPlatform {
  try {
    const raw = sessionStorage.getItem(
      GROWTH_ORGANIC_ACCOUNT_BY_PLATFORM_STORAGE_KEY,
    );
    if (!raw) return {};
    return JSON.parse(raw) as OrganicAccountIdByPlatform;
  } catch {
    return {};
  }
}

export function writeOrganicAccountIdForPlatform(
  platform: GrowthPlatform,
  accountId: string,
): void {
  try {
    const next = {
      ...readOrganicAccountIdByPlatform(),
      [platform]: accountId,
    };
    sessionStorage.setItem(
      GROWTH_ORGANIC_ACCOUNT_BY_PLATFORM_STORAGE_KEY,
      JSON.stringify(next),
    );
  } catch {
    // ignore
  }
}

/** Prefer last picked account for this platform; otherwise the first connected one. */
export function pickOrganicAccountForPlatform(
  accounts: OrganicAccount[],
  platform: GrowthPlatform,
): OrganicAccount | undefined {
  const forPlatform = accounts.filter((account) => account.platform === platform);
  if (forPlatform.length === 0) return undefined;

  const rememberedId = readOrganicAccountIdByPlatform()[platform];
  if (rememberedId) {
    const remembered = forPlatform.find((account) => account.id === rememberedId);
    if (remembered) return remembered;
  }

  return forPlatform[0];
}
