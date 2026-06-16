import { format, lastDayOfMonth, startOfMonth } from "date-fns";

import { supabase } from "@/shared/lib/supabase";
import type {
  Post,
  Slot,
  SlotClient,
  StatusKey,
  PostLinks,
} from "@/features/posts-management/types/types";
import { getDayLabel } from "@/features/posts-management/utils/calendarUtils";
import { toPostDateString, comparePostTimes } from "@/features/posts-management/utils/postScheduleUtils";

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

export function toScheduledDate(
  year: number,
  month: number,
  date: number,
): string {
  return toPostDateString(year, month, date);
}

function getMonthDateRange(year: number, month: number) {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = lastDayOfMonth(monthStart);

  return {
    start: format(monthStart, "yyyy-MM-dd"),
    end: format(monthEnd, "yyyy-MM-dd"),
  };
}

export function postToSlotClient(post: Post): SlotClient {
  return {
    id: post.id,
    projectId: post.project_id,
    name: post.project_name ?? "Unknown project",
    clientName: post.client_name,
    postTitle: post.post_title ?? null,
    socials: post.socials ?? null,
    postLinks: post.post_links ?? null,
    scheduledDate: post.scheduled_date,
    scheduledTime: post.scheduled_time,
    postedDate: post.posted_date,
    postedTime: post.posted_time,
    status: post.status,
  };
}

export function postsToSlots(posts: Post[], year: number, month: number): Slot[] {
  const clientsByDate = new Map<number, SlotClient[]>();

  for (const post of posts) {
    const [postYear, postMonth, postDay] = post.scheduled_date
      .split("-")
      .map(Number);

    if (postYear !== year || postMonth !== month) {
      continue;
    }

    const dayClients = clientsByDate.get(postDay) ?? [];
    dayClients.push(postToSlotClient(post));
    clientsByDate.set(postDay, dayClients);
  }

  return Array.from(clientsByDate.entries())
    .sort(([dayA], [dayB]) => dayA - dayB)
    .map(([date, clients]) => ({
      year,
      month,
      date,
      day: getDayLabel(year, month, date),
      clients: clients.sort((a, b) =>
        comparePostTimes(a.scheduledTime, b.scheduledTime),
      ),
    }));
}

export async function fetchPostsForMonth(
  year: number,
  month: number,
): Promise<Post[]> {
  const { start, end } = getMonthDateRange(year, month);

  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .gte("scheduled_date", start)
    .lte("scheduled_date", end)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapPostRow(row as unknown as PostRow));
}

type PostDateTimeInput = {
  date: string;
  time: string;
};

type CreatePostInput = {
  projectId: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks?: PostLinks | null;
  scheduled: PostDateTimeInput;
  posted: PostDateTimeInput | null;
  status: StatusKey;
};

type UpdatePostInput = CreatePostInput;

export async function createPost(input: CreatePostInput): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      project_id: input.projectId,
      post_title: input.postTitle,
      socials: input.socials,
      post_links: input.postLinks || {},
      scheduled_date: input.scheduled.date,
      scheduled_time: input.scheduled.time,
      posted_date: input.posted?.date ?? null,
      posted_time: input.posted?.time ?? null,
      status: input.status,
    })
    .select(postSelect)
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
    .from("posts")
    .update({
      project_id: input.projectId,
      post_title: input.postTitle,
      socials: input.socials,
      post_links: input.postLinks || {},
      scheduled_date: input.scheduled.date,
      scheduled_time: input.scheduled.time,
      posted_date: input.posted?.date ?? null,
      posted_time: input.posted?.time ?? null,
      status: input.status,
    })
    .eq("id", postId)
    .select(postSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapPostRow(data as unknown as PostRow);
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw error;
  }
}

export async function fetchPostsForClientId(clientId: string): Promise<Post[]> {
  const { data: projectRows, error: projectError } = await supabase
    .from("projects")
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
    .from("posts")
    .select(postSelect)
    .in("project_id", projectIds)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapPostRow(row as unknown as PostRow));
}

export async function fetchPostsCount(): Promise<number> {
  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}
