/**
 * Google Ads API helpers for Digi Carotene Growth connect flow.
 * Docs: https://developers.google.com/google-ads/api/rest/auth
 */

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
/** Pin a stable REST version; bump when Google deprecates. */
const GOOGLE_ADS_API_VERSION = "v19";
const GOOGLE_ADS_BASE = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

export type GoogleAdsCustomerInfo = {
  accountName: string;
  currency: string;
  customerId: string;
};

export type GoogleAdsConnectCredentials = {
  customerId: string;
  loginCustomerId: string;
  developerToken: string;
  oauthClientId: string;
  oauthClientSecret: string;
  oauthRefreshToken: string;
};

/** Strip hyphens/spaces — Google Ads IDs are 10 digits with no punctuation. */
export function normalizeGoogleCustomerId(raw: string): string {
  return raw.trim().replace(/[-\s]/g, "");
}

async function exchangeRefreshToken(creds: {
  oauthClientId: string;
  oauthClientSecret: string;
  oauthRefreshToken: string;
}): Promise<string> {
  const body = new URLSearchParams({
    client_id: creds.oauthClientId.trim(),
    client_secret: creds.oauthClientSecret.trim(),
    refresh_token: creds.oauthRefreshToken.trim(),
    grant_type: "refresh_token",
  });

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !json.access_token) {
    throw new Error(
      json.error_description ||
        json.error ||
        "Google OAuth failed — check client ID, secret, and refresh token.",
    );
  }

  return json.access_token;
}

type GoogleAdsSearchRow = {
  customer?: {
    id?: string;
    descriptiveName?: string;
    currencyCode?: string;
  };
};

/**
 * Validates Digi Carotene can reach the client Google Ads account via MCC
 * credentials (same pattern as Meta system-user token + act_…).
 */
export async function fetchGoogleAdsCustomerInfo(
  creds: GoogleAdsConnectCredentials,
): Promise<GoogleAdsCustomerInfo> {
  const customerId = normalizeGoogleCustomerId(creds.customerId);
  if (!/^\d{6,12}$/.test(customerId)) {
    throw new Error(
      "Google Ads Customer ID should be digits only (e.g. 1234567890).",
    );
  }

  const loginCustomerId = normalizeGoogleCustomerId(creds.loginCustomerId);
  if (!loginCustomerId) {
    throw new Error(
      "Manager (login) Customer ID is required when connecting via Digi Carotene’s MCC.",
    );
  }

  const developerToken = creds.developerToken.trim();
  if (!developerToken) {
    throw new Error("Paste the Google Ads API developer token.");
  }

  const accessToken = await exchangeRefreshToken({
    oauthClientId: creds.oauthClientId,
    oauthClientSecret: creds.oauthClientSecret,
    oauthRefreshToken: creds.oauthRefreshToken,
  });

  const response = await fetch(
    `${GOOGLE_ADS_BASE}/customers/${customerId}/googleAds:search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": developerToken,
        "login-customer-id": loginCustomerId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1",
      }),
    },
  );

  const json = (await response.json()) as {
    results?: GoogleAdsSearchRow[];
    error?: { message?: string; status?: string };
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      json.error?.message ||
        json.message ||
        `Google Ads API error (${response.status}). Check developer token, MCC link, and customer ID.`,
    );
  }

  const customer = json.results?.[0]?.customer;
  if (!customer?.id) {
    throw new Error(
      "Google Ads returned no customer. Confirm the account is linked under Digi Carotene’s manager account.",
    );
  }

  return {
    customerId: String(customer.id),
    accountName: customer.descriptiveName?.trim() || "",
    currency: customer.currencyCode?.trim() || "",
  };
}
