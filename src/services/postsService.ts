import { format, lastDayOfMonth, startOfMonth } from "date-fns";

import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Post, StatusKey, PostLinks } from "@/features/posts-management/types/types";
import { getPostStatusUpdateFields } from "@/features/posts-management/utils/postStatusUtils";

// Supabase returns nested relations as either an object or an array.
// PostRow + mapPostRow flatten that into our flat Post type.
export type PostRow = Post & {
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

export function mapPostRow(row: PostRow): Post {
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

function mapPostRows(rows: unknown[]): Post[] {
  return rows.map((row) => mapPostRow(row as PostRow));
}

function todayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export type PostDateTimeInput = {
  date: string;
  time: string;
};

export type CreatePostInput = {
  projectId: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks?: PostLinks | null;
  toBePostedOn: PostDateTimeInput;
  posted: PostDateTimeInput | null;
  status: StatusKey;
};

export type UpdatePostInput = CreatePostInput;

export async function fetchAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .order("to_be_posted_date", { ascending: true })
    .order("to_be_posted_time", { ascending: true });

  if (error) {
    throw error;
  }

  return mapPostRows(data ?? []);
}

export async function fetchPostsForMonth(
  year: number,
  month: number,
): Promise<Post[]> {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const start = format(monthStart, "yyyy-MM-dd");
  const end = format(lastDayOfMonth(monthStart), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .gte("to_be_posted_date", start)
    .lte("to_be_posted_date", end)
    .order("to_be_posted_date", { ascending: true })
    .order("to_be_posted_time", { ascending: true });

  if (error) {
    throw error;
  }

  return mapPostRows(data ?? []);
}

export async function fetchPostsForProjectId(projectId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .eq("project_id", projectId)
    .order("to_be_posted_date", { ascending: false })
    .order("to_be_posted_time", { ascending: false });

  if (error) {
    throw error;
  }

  return mapPostRows(data ?? []);
}

export async function fetchPostsForClientId(clientId: string): Promise<Post[]> {
  const { data: projectRows, error: projectError } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select("id")
    .eq("client_id", clientId);

  if (projectError) {
    throw projectError;
  }

  const projectIds = (projectRows ?? []).map((row) => row.id);
  if (projectIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .in("project_id", projectIds)
    .order("to_be_posted_date", { ascending: true })
    .order("to_be_posted_time", { ascending: true });

  if (error) {
    throw error;
  }

  return mapPostRows(data ?? []);
}

export async function fetchTodayPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .eq("to_be_posted_date", todayDateString())
    .order("to_be_posted_time", { ascending: true });

  if (error) {
    throw error;
  }

  return mapPostRows(data ?? []);
}

export async function fetchNotPostedPosts(limit?: number): Promise<Post[]> {
  let query = supabase
    .from(DB.POSTS.TABLE)
    .select(DB.POSTS.SELECT)
    .eq("status", "Not posted")
    .order("to_be_posted_date", { ascending: true })
    .order("to_be_posted_time", { ascending: true });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return mapPostRows(data ?? []);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .insert({
      project_id: input.projectId,
      post_title: input.postTitle,
      socials: input.socials,
      post_links: input.postLinks || {},
      to_be_posted_date: input.toBePostedOn.date,
      to_be_posted_time: input.toBePostedOn.time,
      posted_date: input.posted?.date ?? null,
      posted_time: input.posted?.time ?? null,
      status: input.status,
    })
    .select(DB.POSTS.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapPostRow(data as unknown as PostRow);
}

export async function updatePost(
  postId: string,
  input: UpdatePostInput,
): Promise<Post> {
  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .update({
      project_id: input.projectId,
      post_title: input.postTitle,
      socials: input.socials,
      post_links: input.postLinks || {},
      to_be_posted_date: input.toBePostedOn.date,
      to_be_posted_time: input.toBePostedOn.time,
      posted_date: input.posted?.date ?? null,
      posted_time: input.posted?.time ?? null,
      status: input.status,
    })
    .eq("id", postId)
    .select(DB.POSTS.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapPostRow(data as unknown as PostRow);
}

export async function updatePostStatus(
  postId: string,
  status: StatusKey,
): Promise<Post> {
  const { postedDate, postedTime } = getPostStatusUpdateFields(status);

  const { data, error } = await supabase
    .from(DB.POSTS.TABLE)
    .update({ status, posted_date: postedDate, posted_time: postedTime })
    .eq("id", postId)
    .select(DB.POSTS.SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapPostRow(data as unknown as PostRow);
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from(DB.POSTS.TABLE).delete().eq("id", postId);

  if (error) {
    throw error;
  }
}
