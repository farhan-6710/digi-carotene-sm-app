export const GROWTH_ACCOUNTS_UPDATED_EVENT = "growth-accounts-updated";

export function notifyGrowthAccountsUpdated() {
  window.dispatchEvent(new CustomEvent(GROWTH_ACCOUNTS_UPDATED_EVENT));
}
