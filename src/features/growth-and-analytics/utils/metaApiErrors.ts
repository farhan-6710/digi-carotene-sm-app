type MetaGraphError = {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  error_user_title?: string;
  error_user_msg?: string;
};

/** Prefer Meta’s own user-facing text when present; otherwise the API message. */
function metaRawMessage(error: MetaGraphError | string): string {
  if (typeof error === "string") return error.trim();
  const userMsg = error.error_user_msg?.trim();
  if (userMsg) return userMsg;
  const userTitle = error.error_user_title?.trim();
  const apiMsg = error.message?.trim();
  if (userTitle && apiMsg) return `${userTitle}: ${apiMsg}`;
  return apiMsg || userTitle || "Meta rejected the request.";
}

/**
 * Maps Meta Graph errors to short, actionable copy.
 * Only remaps clear cases — otherwise returns Meta’s message (not a guess).
 */
export function formatMetaApiError(
  errorOrMessage: MetaGraphError | string,
  accountName?: string,
): string {
  const message = metaRawMessage(errorOrMessage);
  const normalized = message.toLowerCase();
  const code =
    typeof errorOrMessage === "object" ? errorOrMessage.code : undefined;
  const label = accountName ? ` (${accountName})` : "";

  // Wrong / unknown account or object id (often looks like a permission error from Meta).
  if (
    normalized.includes("does not exist") ||
    normalized.includes("unsupported get request") ||
    normalized.includes("nonexisting field") ||
    normalized.includes("invalid id") ||
    normalized.includes("unknown path components") ||
    code === 803
  ) {
    return `Meta could not find this account id${label}. Check the Account ID and try again.`;
  }

  if (
    normalized.includes("session has expired") ||
    normalized.includes("error validating access token") ||
    normalized.includes("invalid oauth access token") ||
    normalized.includes("access token expired") ||
    code === 190
  ) {
    // (#190) is also used for Page-token-required; check that next via message.
    if (
      normalized.includes("page access token") ||
      normalized.includes("page access")
    ) {
      return `Facebook Page Insights need a Page Access Token${label}. Assign the Page to Digi Carotene’s system user, then reconnect with Digi Carotene’s long-lived token.`;
    }
    return `Meta access token expired${label}. Open Manage Accounts, edit the account, and paste a new token.`;
  }

  if (
    normalized.includes("page access token") ||
    (code === 190 && normalized.includes("page"))
  ) {
    return `Facebook Page Insights need a Page Access Token${label}. Assign the Page to Digi Carotene’s system user, then reconnect with Digi Carotene’s long-lived token.`;
  }

  // Real missing-permission cases — do not treat “object not accessible” as insights.
  if (
    (normalized.includes("permission") || code === 200) &&
    !normalized.includes("does not exist") &&
    !normalized.includes("unsupported get request")
  ) {
    // Meta often says “permission” for a wrong/unlinked ad account too.
    if (
      normalized.includes("access this object") ||
      normalized.includes("access the object") ||
      normalized.includes("not authorized") ||
      normalized.includes("cannot access")
    ) {
      return `This Meta account id is not available with the pasted token${label}. Confirm the Account ID is correct and assigned to Digi Carotene’s system user.`;
    }
    return `Missing Meta permissions${label}. Use a token with insights access for this account. Meta said: ${message}`;
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
