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
  projects:sm_projects (
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
  is_active,
  created_at,
  updated_at,
  clients ( id, client_name ),
  team_members:manager_id ( id, member_name, team_role )
`;

const DEV_PROJECT_SELECT = `
  id,
  project_name,
  client_id,
  manager_id,
  description,
  tech_stack,
  repo_url,
  staging_url,
  production_url,
  start_date,
  target_date,
  is_active,
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
  projects:sm_projects (
    id,
    project_name,
    client_id,
    clients ( id, client_name )
  )
`;

const DEV_ASSIGNMENT_SELECT = `
  id,
  project_id,
  member_id,
  started_at,
  ended_at,
  created_at,
  updated_at,
  projects:dev_projects (
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
  projects:sm_projects (
    project_name,
    manager_id,
    clients ( client_name )
  ),
  requester:team_members!requested_by_team_member_id (
    member_name
  )
`;

const PRODUCTION_PLAN_SELECT = `
  id,
  client_id,
  plan_name,
  plan_description,
  shoot_date,
  reels_count,
  images_count,
  carousels_count,
  manager_id,
  shoot_incharge_id,
  created_at,
  updated_at,
  clients (
    id,
    client_name
  ),
  manager:team_members!manager_id (
    id,
    member_name
  ),
  shoot_incharge:team_members!shoot_incharge_id (
    id,
    member_name
  )
`;

const PLAN_ASSIGNMENT_SELECT = `
  id,
  production_plan_id,
  member_id,
  started_at,
  ended_at,
  created_at,
  updated_at,
  production_plans (
    id,
    plan_name,
    client_id,
    clients ( id, client_name )
  )
`;

const PRODUCTION_PLAN_ITEM_SELECT = `
  id,
  production_plan_id,
  item_name,
  script,
  reference_link,
  manager_approval,
  shoot_incharge_approval,
  client_approval,
  created_at,
  updated_at
`;

const TASK_SELECT = `
  id,
  project_id,
  client_id,
  dependency_client_id,
  title,
  description,
  created_by_team_member_id,
  assigned_to_team_member_id,
  priority,
  eta_date,
  eta_time,
  status,
  created_at,
  updated_at,
  projects:sm_projects (
    id,
    project_name,
    manager_id,
    manager:team_members!manager_id ( id, member_name ),
    clients ( id, client_name )
  ),
  client:clients!client_id (
    id,
    client_name
  ),
  dependency_client:clients!dependency_client_id (
    id,
    client_name
  ),
  created_by:team_members!created_by_team_member_id (
    id,
    member_name
  ),
  assigned_to:team_members!assigned_to_team_member_id (
    id,
    member_name
  ),
  task_tags (
    team_member_id,
    team_members ( id, member_name )
  ),
  task_assignees (
    team_member_id,
    client_id,
    team_members ( id, member_name ),
    clients ( id, client_name )
  )
`;

const TASK_TAG_SELECT = `
  id,
  task_id,
  team_member_id,
  created_at
`;

const TASK_MESSAGE_SELECT = `
  id,
  task_id,
  author_team_member_id,
  author_client_id,
  body,
  created_at,
  author:team_members!author_team_member_id (
    id,
    member_name
  ),
  author_client:clients!author_client_id (
    id,
    client_name
  )
`;

const SUBTASK_SELECT = `
  id,
  parent_task_id,
  title,
  description,
  created_by_team_member_id,
  created_by_client_id,
  assigned_to_team_member_id,
  assigned_to_client_id,
  priority,
  eta_date,
  eta_time,
  status,
  created_at,
  updated_at,
  created_by:team_members!created_by_team_member_id (
    id,
    member_name
  ),
  created_by_client:clients!created_by_client_id (
    id,
    client_name
  ),
  assigned_to:team_members!assigned_to_team_member_id (
    id,
    member_name
  ),
  assigned_to_client:clients!assigned_to_client_id (
    id,
    client_name
  ),
  subtask_assignees (
    team_member_id,
    client_id,
    team_members ( id, member_name ),
    clients ( id, client_name )
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
    TABLE: "sm_projects",
    SELECT: PROJECT_SELECT,
  },
  DEV_PROJECTS: {
    TABLE: "dev_projects",
    SELECT: DEV_PROJECT_SELECT,
  },
  PROJECT_TEAM_MEMBERS: {
    TABLE: "project_team_members",
    SELECT: ASSIGNMENT_SELECT,
  },
  DEV_PROJECT_TEAM_MEMBERS: {
    TABLE: "dev_project_team_members",
    SELECT: DEV_ASSIGNMENT_SELECT,
  },
  POSTS: {
    TABLE: "posts",
    SELECT: POST_SELECT,
  },
  POST_APPROVAL_REQUESTS: {
    TABLE: "post_approval_requests",
    SELECT: APPROVAL_SELECT,
  },
  NOTIFICATIONS: {
    TABLE: "notifications",
    SELECT:
      "id, recipient_team_member_id, notification_type, title, message, status, related_id, created_at, read_at",
  },
  PRODUCTION_PLANS: {
    TABLE: "production_plans",
    SELECT: PRODUCTION_PLAN_SELECT,
  },
  PRODUCTION_PLAN_ITEMS: {
    TABLE: "production_plan_items",
    SELECT: PRODUCTION_PLAN_ITEM_SELECT,
  },
  PRODUCTION_PLAN_TEAM_MEMBERS: {
    TABLE: "production_plan_team_members",
    SELECT: PLAN_ASSIGNMENT_SELECT,
  },
  TASKS: {
    TABLE: "tasks",
    SELECT: TASK_SELECT,
  },
  TASK_TAGS: {
    TABLE: "task_tags",
    SELECT: TASK_TAG_SELECT,
  },
  TASK_ASSIGNEES: {
    TABLE: "task_assignees",
    SELECT: "id, task_id, team_member_id, client_id, created_at",
  },
  TASK_MESSAGES: {
    TABLE: "task_messages",
    SELECT: TASK_MESSAGE_SELECT,
  },
  SUBTASKS: {
    TABLE: "subtasks",
    SELECT: SUBTASK_SELECT,
  },
  SUBTASK_ASSIGNEES: {
    TABLE: "subtask_assignees",
    SELECT: "id, subtask_id, team_member_id, client_id, created_at",
  },
  LEADS: {
    TABLE: "leads",
    SELECT:
      "id, name, company, email, phone, industry, lead_score, status, lead_source, address, created_at, updated_at",
  },
  LEAD_NOTES: {
    TABLE: "lead_notes",
    SELECT: "id, lead_id, body, created_at, updated_at",
  },
  GROWTH_ORGANIC_ACCOUNTS: {
    TABLE: "growth_organic_accounts",
    SELECT:
      "id, platform, account_name, account_id, followers, profile_picture, is_active, client_id, created_at",
  },
  GROWTH_ORGANIC_PROFILES: {
    TABLE: "growth_organic_profiles",
    SELECT:
      "id, instagram_id, username, followers_count, organic_account_id, created_at",
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
