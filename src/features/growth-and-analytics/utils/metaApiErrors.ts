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
