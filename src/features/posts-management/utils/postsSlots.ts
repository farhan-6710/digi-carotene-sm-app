import type { Post, Slot, SlotClient } from "@/features/posts-management/types/types";
import { getDayLabel } from "@/features/posts-management/utils/calendarUtils";
import { comparePostTimes } from "@/features/posts-management/utils/postScheduleUtils";

export function postToSlotClient(post: Post): SlotClient {
  return {
    id: post.id,
    projectId: post.project_id,
    name: post.project_name ?? "Unknown project",
    clientName: post.client_name,
    postTitle: post.post_title ?? null,
    socials: post.socials ?? null,
    postLinks: post.post_links ?? null,
    toBePostedDate: post.to_be_posted_date,
    toBePostedTime: post.to_be_posted_time,
    postedDate: post.posted_date,
    postedTime: post.posted_time,
    status: post.status,
  };
}

// Groups posts into calendar day slots for the given month.
export function postsToSlots(posts: Post[], year: number, month: number): Slot[] {
  const clientsByDate = new Map<number, SlotClient[]>();

  for (const post of posts) {
    const [postYear, postMonth, postDay] = post.to_be_posted_date
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
        comparePostTimes(a.toBePostedTime, b.toBePostedTime),
      ),
    }));
}
