// Central map of database tables and the columns each service reads.
// Use it like: DB.POSTS.TABLE and DB.POSTS.SELECT.
// Keeping table names and select strings in one place makes services easy to read.

const POST_SELECT = `
  id,
  project_id,
  post_title,
  post_type,
  socials,
  post_links,
  to_be_posted_date,
  to_be_posted_time,
  posted_date,
  posted_time,
  status,
  created_at,
  projects (
    project_name,
    clients ( client_name )
  )
`;

const PROJECT_SELECT = `
  id,
  project_name,
  client_id,
  socials,
  manager_id,
  created_at,
  updated_at,
  clients ( id, client_name ),
  team_members:manager_id ( id, member_name, team_role )
`;

const ASSIGNMENT_SELECT = `
  id,
  project_id,
  member_id,
  started_at,
  ended_at,
  created_at,
  updated_at,
  projects (
    id,
    project_name,
    client_id,
    clients ( id, client_name )
  )
`;

const APPROVAL_SELECT = `
  id,
  status,
  project_id,
  requested_by_team_member_id,
  reviewed_by_team_member_id,
  reviewed_at,
  rejection_reason,
  approved_post_id,
  post_payload,
  created_at,
  projects (
    project_name,
    manager_id,
    clients ( client_name )
  ),
  requester:team_members!requested_by_team_member_id (
    member_name
  )
`;

export const DB = {
  PROFILES: {
    TABLE: "profiles",
    SELECT: "id, role, client_id, team_member_id",
  },
  TEAM_MEMBERS: {
    TABLE: "team_members",
    SELECT: "*",
  },
  CLIENTS: {
    TABLE: "clients",
    SELECT: "*",
  },
  PROJECTS: {
    TABLE: "projects",
    SELECT: PROJECT_SELECT,
  },
  PROJECT_TEAM_MEMBERS: {
    TABLE: "project_team_members",
    SELECT: ASSIGNMENT_SELECT,
  },
  POSTS: {
    TABLE: "posts",
    SELECT: POST_SELECT,
  },
  POST_APPROVAL_REQUESTS: {
    TABLE: "post_approval_requests",
    SELECT: APPROVAL_SELECT,
  },
  GROWTH_ORGANIC_ACCOUNTS: {
    TABLE: "growth_organic_accounts",
    SELECT:
      "id, platform, account_name, account_id, followers, profile_picture, is_active, client_id, created_at",
  },
  GROWTH_ORGANIC_PROFILES: {
    TABLE: "growth_organic_profiles",
    SELECT: "id, instagram_id, username, followers_count, organic_account_id, created_at",
  },
  GROWTH_ORGANIC_POSTS_METRICS: {
    TABLE: "growth_organic_posts_metrics",
    SELECT:
      "id, account_id, post_id, caption, media_type, created_at, reach, impressions, likes, comments, saves, shares, reposts, post_thumbnail",
  },
  GROWTH_ORGANIC_DAILY_FOLLOWERS: {
    TABLE: "growth_organic_daily_followers",
    SELECT: "date, followers_gained",
  },
  GROWTH_ADS_ACCOUNTS: {
    TABLE: "growth_ads_accounts",
    SELECT:
      "id, client_id, client_name, account_name, ad_account_id, currency_code, created_at",
  },
  CURRENCIES: {
    TABLE: "currencies",
    SELECT: "code, name, symbol",
  },
  GROWTH_ADS_CAMPAIGN_DAILY_METRICS: {
    TABLE: "growth_ads_campaign_daily_metrics",
    SELECT:
      "id, ad_account_id, campaign_id, campaign_name, status, objective, metric_date, spend, impressions, reach, clicks, cpm, frequency, conversions",
  },
  GROWTH_ADS_ADSETS: {
    TABLE: "growth_ads_adsets",
    SELECT:
      "id, ad_account_id, campaign_id, adset_id, adset_name, performance_goal, location_summary, age_summary, custom_targeting_summary, detailed_targeting_summary, placements_summary",
  },
  GROWTH_ADS_ADSET_DAILY_METRICS: {
    TABLE: "growth_ads_adset_daily_metrics",
    SELECT:
      "id, ad_account_id, campaign_id, adset_id, adset_name, metric_date, spend, impressions, reach, clicks, cpm, frequency, conversions",
  },
  GROWTH_ADS_ADS: {
    TABLE: "growth_ads_ads",
    SELECT:
      "id, ad_account_id, campaign_id, adset_id, ad_id, ad_name, thumbnail_url, primary_text, headline",
  },
  GROWTH_ADS_AD_DAILY_METRICS: {
    TABLE: "growth_ads_ad_daily_metrics",
    SELECT:
      "id, ad_account_id, campaign_id, adset_id, ad_id, ad_name, metric_date, spend, impressions, reach, clicks, cpm, frequency, conversions",
  },
} as const;
