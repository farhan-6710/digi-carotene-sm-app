// Meta Graph API configuration for the Growth & Analytics module.
// Access tokens are entered per account in Manage Accounts — never hard-coded here.

export const META_GRAPH_BASE_URL = "https://graph.facebook.com";

// Instagram organic uses v19.0 in sm-report; pages/ads use v18.0.
export const INSTAGRAM_BACKFILL_DAYS = 29;
export const AD_BACKFILL_DAYS = 90;

export const META_API_VERSION = {
  instagram: "v19.0",
  instagramBackfill: "v24.0",
  facebook: "v18.0",
  ads: "v18.0",
} as const;

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
