export function formatMetaApiError(message: string, accountName?: string): string {
  const normalized = message.toLowerCase();
  const label = accountName ? ` (${accountName})` : "";

  if (
    normalized.includes("session has expired") ||
    normalized.includes("error validating access token") ||
    normalized.includes("invalid oauth access token") ||
    normalized.includes("access token expired")
  ) {
    return `Meta access token expired${label}. Open Manage Accounts, edit the account, and paste a new token.`;
  }

  if (normalized.includes("permission") || normalized.includes("(#200)")) {
    return `Missing Meta permissions${label}. Use a token with insights access for this account.`;
  }

  if (
    normalized.includes("page access token") ||
    normalized.includes("(#190)")
  ) {
    return `Facebook Page Insights need a Page Access Token${label}. Assign the Page to Digi Carotene’s system user, then reconnect the account (or refresh the token) in Manage Accounts.`;
  }

  return message;
}

export function isMetaTokenExpiredError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("session has expired") ||
    normalized.includes("error validating access token") ||
    normalized.includes("invalid oauth access token") ||
    normalized.includes("access token expired")
  );
}
