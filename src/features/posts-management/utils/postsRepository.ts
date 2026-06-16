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
    name: post.client_name,
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
    .select("*")
    .gte("scheduled_date", start)
    .lte("scheduled_date", end)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Post[];
}

type PostDateTimeInput = {
  date: string;
  time: string;
};

type CreatePostInput = {
  clientName: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks?: PostLinks | null;
  scheduled: PostDateTimeInput;
  posted: PostDateTimeInput | null;
  status: StatusKey;
};

type UpdatePostInput = {
  clientName: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks?: PostLinks | null;
  scheduled: PostDateTimeInput;
  posted: PostDateTimeInput | null;
  status: StatusKey;
};

export async function createPost(input: CreatePostInput): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      client_name: input.clientName,
      post_title: input.postTitle,
      socials: input.socials,
      post_links: input.postLinks || {},
      scheduled_date: input.scheduled.date,
      scheduled_time: input.scheduled.time,
      posted_date: input.posted?.date ?? null,
      posted_time: input.posted?.time ?? null,
      status: input.status,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function updatePost(
  postId: string,
  input: UpdatePostInput,
): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .update({
      client_name: input.clientName,
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
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw error;
  }
}

export async function fetchPostsForClientName(
  clientName: string,
): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("client_name", clientName)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Post[];
}
