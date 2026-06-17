import {
  CalendarClock,
  CheckCircle2,
  FileText,
  XCircle,
} from "lucide-react";

import type { Post } from "@/features/posts-management/types/types";
import type { StatCardItem } from "@/shared/types/statsCards";

function countByStatus(posts: Post[], status: Post["status"]): number {
  return posts.filter((post) => post.status === status).length;
}

export function buildPortalStatCards(posts: Post[]): StatCardItem[] {
  return [
    {
      id: "portal-total-posts",
      label: "Total posts",
      value: String(posts.length),
      description: "All content for your brand",
      icon: FileText,
      href: "/portal/posts",
    },
    {
      id: "portal-scheduled",
      label: "Scheduled",
      value: String(countByStatus(posts, "Scheduled")),
      description: "Waiting to go live",
      icon: CalendarClock,
      href: "/portal/posts",
    },
    {
      id: "portal-posted",
      label: "Posted",
      value: String(countByStatus(posts, "Posted")),
      description: "Published successfully",
      icon: CheckCircle2,
      href: "/portal/posts",
    },
    {
      id: "portal-not-posted",
      label: "Not posted",
      value: String(countByStatus(posts, "Not posted")),
      description: "Missed or pending action",
      icon: XCircle,
      href: "/portal/posts",
    },
  ];
}

export function getUpcomingPosts(posts: Post[], limit = 5): Post[] {
  const today = new Date().toISOString().slice(0, 10);

  return posts
    .filter(
      (post) => post.status !== "Posted" && post.scheduled_date >= today,
    )
    .sort((a, b) => {
      const dateCompare = a.scheduled_date.localeCompare(b.scheduled_date);
      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "");
    })
    .slice(0, limit);
}
