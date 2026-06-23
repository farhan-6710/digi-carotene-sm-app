import { format } from "date-fns";

import { supabase } from "@/shared/lib/supabase";
import type { Post, StatusKey } from "@/features/posts-management/types/types";

const postSelect = `
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

type PostRow = Post & {
  projects:
    | {
        project_name: string;
        clients: { client_name: string } | { client_name: string }[] | null;
      }
    | {
        project_name: string;
        clients: { client_name: string } | { client_name: string }[] | null;
      }[]
    | null;
};

function mapPostRow(row: PostRow): Post {
  const project = Array.isArray(row.projects) ? row.projects[0] ?? null : row.projects;
  const client = project?.clients
    ? Array.isArray(project.clients)
      ? project.clients[0] ?? null
      : project.clients
    : null;

  return {
    id: row.id,
    project_id: row.project_id,
    project_name: project?.project_name,
    client_name: client?.client_name,
    post_title: row.post_title,
    socials: row.socials,
    post_links: row.post_links,
    to_be_posted_date: row.to_be_posted_date,
    to_be_posted_time: row.to_be_posted_time,
    posted_date: row.posted_date,
    posted_time: row.posted_time,
    status: row.status,
    created_at: row.created_at,
  };
}

export function formatReportDateRangeLabel(
  from: Date | undefined,
  to: Date | undefined,
): string {
  if (!from) {
    return "Select date range";
  }

  if (!to) {
    return format(from, "MMM d, yyyy");
  }

  if (format(from, "yyyy-MM-dd") === format(to, "yyyy-MM-dd")) {
    return format(from, "MMM d, yyyy");
  }

  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
}

export async function fetchPostsForDateRange(
  startDate: string,
  endDate: string,
  statuses?: StatusKey[] | null,
): Promise<Post[]> {
  if (statuses !== null && statuses !== undefined && statuses.length === 0) {
    return [];
  }

  let query = supabase
    .from("posts")
    .select(postSelect)
    .gte("to_be_posted_date", startDate)
    .lte("to_be_posted_date", endDate)
    .order("to_be_posted_date", { ascending: true })
    .order("to_be_posted_time", { ascending: true });

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapPostRow(row as unknown as PostRow));
}

export function toReportDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
