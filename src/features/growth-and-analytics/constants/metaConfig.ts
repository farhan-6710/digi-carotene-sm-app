// Meta Graph API configuration for the Growth & Analytics module.
// Ported from sm-report-13-3-2026 (backend/config/config.php). The access token
// is entered per account in the connect dialog, never hard-coded here.
//
// Graph API supports CORS GET requests, so the connect flow calls it directly
// from the browser using the token the user pastes in.

export const META_GRAPH_BASE_URL = "https://graph.facebook.com";

// Instagram organic uses v19.0 in sm-report; pages/ads use v18.0.
export const META_API_VERSION = {
  instagram: "v19.0",
  facebook: "v18.0",
  ads: "v18.0",
} as const;

// Public Meta App ID (from sm-report config fallback). Optional override via env.
export const META_APP_ID =
  import.meta.env.VITE_META_APP_ID ?? "872614585203502";

// Fields requested when validating / reading an account on connect.
export const META_ACCOUNT_FIELDS = {
  instagram: "username,name,followers_count,profile_picture_url",
  facebook: "name,fan_count,followers_count",
  ad: "name,currency,account_status",
} as const;

// How many days of history to pull from Meta when an account is connected.
export const META_SYNC_DAYS = 90;

// Meta insights endpoints reject ranges wider than 30 days between since/until.
export const META_INSIGHTS_WINDOW_DAYS = 28;

// follower_count only supports the last 30 days, excluding today.
export const META_FOLLOWER_COUNT_DAYS = 30;

// Cap post sync on connect — each post insight call is a separate Graph API request.
export const META_INITIAL_POST_SYNC_LIMIT = 10;
