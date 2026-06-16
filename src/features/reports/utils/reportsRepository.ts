import { format } from "date-fns";

import { supabase } from "@/shared/lib/supabase";
import type { Post, StatusKey } from "@/features/posts-management/types/types";

const postSelect = `
  id,
  project_id,
  post_title,
  socials,
  post_links,
  scheduled_date,
  scheduled_time,
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
    scheduled_date: row.scheduled_date,
    scheduled_time: row.scheduled_time,
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
  statuses?: StatusKey[],
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select(postSelect)
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

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
