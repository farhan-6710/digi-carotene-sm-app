// Central map of database tables and the columns each service reads.
// Use it like: DB.POSTS.TABLE and DB.POSTS.SELECT.
// Keeping table names and select strings in one place makes services easy to read.

const POST_SELECT = `
  id,
  project_id,
  post_title,
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
} as const;
