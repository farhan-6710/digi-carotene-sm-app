export const GROWTH_ORGANIC_ACCOUNT_PARAM = "account";
export const GROWTH_AD_ACCOUNT_PARAM = "adAccount";
/** Combined organic + ad account selection on Reports / Custom Report Builder. */
export const GROWTH_REPORT_ACCOUNT_PARAM = "reportAccount";

/** Survives Growth sidebar/nav hops that drop `?account=`. */
export const GROWTH_ORGANIC_ACCOUNT_STORAGE_KEY =
  "digi-carotene.growth.organicAccountId";

/** Last selected organic account id per platform (instagram / facebook). */
export const GROWTH_ORGANIC_ACCOUNT_BY_PLATFORM_STORAGE_KEY =
  "digi-carotene.growth.organicAccountByPlatform";

/** Last selected ad account id per ads platform (meta_ads / google_ads). */
export const GROWTH_AD_ACCOUNT_BY_PLATFORM_STORAGE_KEY =
  "digi-carotene.growth.adAccountByPlatform";
